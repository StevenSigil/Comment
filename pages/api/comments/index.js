// .../api/comments
// Retrieves ALL Comment instances

import { connectToDatabase } from "../../../util/mongodb";
import Comments from "../../../models/commentModel";
import Posts from "../../../models/postModel";
import UserProfiles from "../../../models/profileModel";

/**
 * .../api/comments
 *
 * API endpoint to:
 * - GET: retrieve ALL Comments instances
 * - POST: create a new Comment instance
 *
 * Expecting request.body format as:
 * {"message": [VALIDATED-inputText], "image_url": [OPTIONAL-UriToImage],
 * "commenting_user": [UserProfile._id], "post": [Post._id]}
 *
 * TODO: Create a pre-save to check if the UserProfile and Post instances are valid before saving.
 */
export default async (req, res) => {
  await connectToDatabase();
  const method = req.method;

  if (method === "GET") {
    const listOfComments = await Comments.find()
      .populate("post", "meta_title", Posts)
      .populate("commenting_user", ["display_name", "photo_url"], UserProfiles)
      .exec();
    return await res.status(200).json(listOfComments);
  }

  if (method === "POST") {
    const { message, image_url, commenting_user, post } = req.body;

    if (commenting_user && post) {
      try {
        const comment = new Comments({
          message,
          image_url,
          commenting_user,
          post,
        });
        const createdComment = await comment
          .save()
          .catch((e) => console.log(e));

        if (createdComment) {
          console.log("====================================");
          console.log("Comment Saved!");
        }

        const returnComment = await Comments.findById(createdComment._id)
          .populate("post", "meta_title", Posts)
          .populate(
            "commenting_user",
            ["display_name", "photo_url"],
            UserProfiles
          )
          .exec();

        return res.status(201).json(returnComment);
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    }
    return res
      .status(422)
      .json({ message: "Invalid data submitted. Comment was not saved!" });
  }
  return res
    .status(422)
    .json({ message: `${method} request is not supported...` });
};
