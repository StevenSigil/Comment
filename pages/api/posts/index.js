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
 * - POST: Create a new Post instance, Comment instance, and link together with a
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
    const { posting_user, original_url, comment } = req.body;

    if (posting_user && original_url && comment) {
      try {
        const previewData = await getLinkPreview(original_url.toString());
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

        const createdPost = await newPost.save().catch((e) => console.log(e));

        const newComment = new Comments({
          message: comment,
          commenting_user: posting_user,
        });
        newComment.post = createdPost._id;

        const createdComment = await newComment
          .save()
          .catch((e) => console.log(e));

        if (createdPost && createdComment) {
          console.log("====================================");
          console.log("Post and Comment saved!");
        }

        const returnPost = await Posts.findById(createdPost._id);

        return res.status(200).json(returnPost);
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    }
    return res
      .status(422)
      .json({ message: "Invalid data submitted. Post was not saved!" });
  }
  return res
    .status(422)
    .json({ message: `${req.method} request is not supported...` });
};

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
