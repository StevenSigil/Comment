import mongoose from "mongoose";
import { connectToDatabase } from "../../../../util/mongodb";
import { verifyUserProfileExists } from "../../../../util/backendApi";
import Comments from "../../../../models/commentModel";
import UserProfiles from "../../../../models/profileModel";

/**
 * .../api/comments/<Comment._id>/likes
 *
 * API endpoint to add/remove a UserProfiles ID to a Comment.likes array and reverse
 * - Request body should be formatted as
 * {"profileId": <"UserProfiles._id">, "command": "<add || remove>"}
 */
export default async (req, res) => {
  await connectToDatabase();

  const method = req.method;
  const commentId = mongoose.Types.ObjectId(req.query.id);

  if (method === "POST") {
    const profileId = mongoose.Types.ObjectId(req.body.profileId);
    const command = req.body.command;
    const existingProfile = await verifyUserProfileExists(profileId);

    // "add" command
    if (existingProfile.ok && command === "add") {
      // add UserProfiles._id to Comments.likes
      const updatedComment = await Comments.findOneAndUpdate(
        { _id: commentId },
        { $addToSet: { likes: profileId } },
        { new: true }
      ).catch((e) => console.log(e));
      console.log("Comments.likes updated via add\n");

      // add Comment._id to UserProfiles.liked_comments
      const updatedProfile = await UserProfiles.findOneAndUpdate(
        { _id: profileId },
        { $addToSet: { liked_comments: { comment: commentId } } },
        { new: true }
      ).catch((e) => console.log(e));

      console.log(
        "\nUserProfiles.liked_comments updated via add\n",
        updatedProfile,
        commentId,
        "\n"
      );

      return res.status(200).json({
        data: {
          message: "Comment and UserProfiles successfully updated!",
          comment: updatedComment,
          profile: updatedProfile,
        },
      });
    }

    // "remove" command
    if (existingProfile.ok && command === "remove") {
      // remove UserProfiles._id to Comments.likes
      const updatedComment = await Comments.findOneAndUpdate(
        { _id: commentId },
        { $pull: { likes: profileId } },
        { new: true }
      ).catch((e) => console.log(e));
      console.log("Comments.likes updated via remove\n");

      // remove Comment._id to UserProfiles.liked_comments
      const updatedProfile = await UserProfiles.findOneAndUpdate(
        { _id: profileId },
        { $pull: { liked_comments: { comment: commentId } } },
        { new: true }
      ).catch((e) => console.log(e));

      console.log(
        "\nUserProfiles.liked_comments updated via remove\n",
        updatedProfile,
        commentId,
        "\n"
      );

      return res.status(200).json({
        data: {
          message: "Comment and UserProfiles successfully updated!",
          comment: updatedComment,
          profile: updatedProfile,
        },
      });
    }
    return res.status(500).send("Err");
  }

  // GET - same as './index.js'
  const foundComment = await Comments.findById(commentId).exec();
  return res.status(200).json(foundComment);
};
