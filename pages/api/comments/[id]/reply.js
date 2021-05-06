import { connectToDatabase } from "../../../../util/mongodb";
import Comments from "../../../../models/commentModel";

/**
 * .../api/comments/<Comment._id>/reply
 *
 * API endpoint to add a reply to a comment
 * - ie: Create a new comment then Update existing (parent) Comment.replys field
 * to include new Comment._id.
 *
 * - Request body should be formatted as:
 * {"message": <INPUT TEXT>, "image_url": <URI to Image>, "commenting_user":
 * <UserProfile._id>, "post": <Post._id> }
 */
export default async (req, res) => {
  await connectToDatabase();
  const method = req.method;
  const parentComment = await Comments.findById(req.query.id).exec();

  if (method === "POST") {
    if (parentComment.is_replay) {
      return res.status(422).send("Cannot reply to a reply at this time!");
    }
    // create a new comment
    const { message, image_url, commenting_user, post } = req.body;

    if (commenting_user && post) {
      try {
        const replyComment = new Comments({
          message,
          image_url,
          commenting_user,
          post,
          is_reply: true,
        });
        const createdReply = await replyComment.save().catch((e) => {
          console.log("api/comments/[id]/reply: 34", e);
          throw Error("Error creating the reply (new Comment)!", e);
        });

        if (createdReply) {
          console.log("====================================");
          console.log("Comment Saved!\n");
        }

        // Add reply to (parent) comment
        const updatedParentComment = await Comments.findOneAndUpdate(
          { _id: parentComment._id },
          { $addToSet: { replys: createdReply._id } },
          { new: true }
        ).catch((e) => {
          console.log("api/comments/[id]/reply: 48", e);
          throw Error("Error updating parent comment with reply!", e);
        });

        if (updatedParentComment) {
          console.log("====================================");
          console.log("Reply saved to ParentComment!\n", updatedParentComment);
        }

        return res.status(201).json(updatedParentComment);
      } catch (error) {
        console.log("api/comments/[id]/reply: 48", error);
        return res.status(500).send(error);
      }
    }
  }

  // non-POST requests
  return res.status(200).json(parentComment);
};
