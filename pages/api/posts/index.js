import { connectToDatabase } from "../../../util/mongodb";
import getLinkPreview from "../../../util/linkPreview";
import Posts from "../../../models/postModel";
import Comments from "../../../models/commentModel";
import UserProfiles from "../../../models/profileModel";

/**
 * .../api/posts
 *
 * API endpoint to:
 * - GET: retrieve ALL Post instances
 * - POST: Finds or Creates a Post instance, Comment instance, and link together with a
 * given UserProfile instance.
 *
 * Expecting request.body format as:
 * - {"posting_user": "[UserProfileID]", "original_url": "[VALIDATED-userInput]",
 * "comment": "[VALIDATED-userInput]"}
 *
 * All other methods are not allowed.
 */
export default async (req, res) => {
  if (req.method === "GET") {
    const listOfPosts = await getListOfAllPosts();
    return res.status(200).json(listOfPosts);
  }

  if (req.method === "POST") {
    await connectToDatabase();
    const { posting_user, original_url, comment } = await req.body.data;

    if (posting_user && original_url && comment) {
      // Check if the "Post" already exists from original URL
      let foundPost = await tryToFindPostByUrl(original_url);

      if (!foundPost) {
        // No previous Post found... Create new one before adding comment!
        const previewData = await getLinkPreview(original_url);
        const { title, description, domain, img } = previewData;
        const newPost = new Posts({
          posting_user,
          original_url,
          likes: [],
          meta_title: title,
          meta_description: description,
          meta_image: img,
          meta_url: domain,
        });
        foundPost = await newPost.save().catch((e) => console.log(e));
      }

      // Create then add Comment to Post
      const newComment = new Comments({
        message: comment,
        commenting_user: posting_user,
      });
      newComment.post = foundPost._id;

      await newComment.save().catch((e) => console.log(e));

      // return updated post
      const returnPost = await Posts.findById(foundPost._id);
      return res.status(201).json(returnPost);
    }
    return res.status(422).json({
      message: "Invalid data submitted. Post was not saved!",
      original_data: req.body,
    });
  }
  return res
    .status(422)
    .json({ message: `${req.method} request is not supported...` });
};

/** Checks if a post already exists first by the 'original_url' then by meta tags */
async function tryToFindPostByUrl(original_url) {
  const firstCheck = await Posts.findOne({ original_url });

  if (firstCheck) {
    console.log("Post found on first try!");
    return firstCheck;
  }

  // Check if "Post" exists from meta tags
  const previewData = await getLinkPreview(original_url);
  const secondCheck = await Posts.findOne({
    meta_title: previewData.title,
    meta_description: previewData.description,
    meta_image: previewData.img,
  });

  if (secondCheck) {
    console.log("Post found on second try!");
    return secondCheck;
  }

  // Post not found
  return null;
}

/**
 * @returns Populated array of ALL Post instances.
 */
export async function getListOfAllPosts() {
  await connectToDatabase();

  const listOfPosts = await Posts.find()
    .populate("posting_user", ["display_name", "photo_url"], UserProfiles)
    .populate("likes", ["display_name", "photo_url"], UserProfiles)
    .populate({
      path: "comments",
      select: "message date_time likes",
      populate: {
        path: "commenting_user",
        select: "display_name photo_url",
        model: UserProfiles,
      },
      model: Comments,
    })
    .exec();

  return listOfPosts;
}
