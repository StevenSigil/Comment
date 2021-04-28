import mongoose from "mongoose";
import { connectToDatabase } from "../../../../util/mongodb";
import UserProfiles from "../../../../models/profileModel";
import Post from "../../../../models/postModel";

/**
 * .../api/posts/<Post._id>/likes
 *
 * API endpoint to add/remove a UserProfiles ID to a Post.likes array and reverse
 * - Request body should be formatted as
 * {"profileId": <"UserProfiles._id">, "command": "<add || remove>"}
 */
export default async (req, res) => {
  await connectToDatabase();

  const method = req.method;
  const postId = req.query.id;

  if (method === "POST") {
    if (req.body.profileId && req.body.command) {
      const profileId = new mongoose.Types.ObjectId(req.body.profileId);
      const command = req.body.command;
      const existingProfile = await verifyUserProfileExists(profileId);

      // "add" command
      if (existingProfile.ok && command === "add") {
        // add UserProfiles._id to Post.likes
        const updatedPost = await Post.findOneAndUpdate(
          { _id: postId },
          { $addToSet: { likes: profileId } },
          { new: true }
        ).catch((e) => console.log(e));
        console.log("Post.likes updated via add");

        // add Profile._id to UserProfiles.liked_posts
        const updatedProfile = await UserProfiles.findOneAndUpdate(
          { _id: profileId },
          { $addToSet: { liked_posts: updatedPost._id } },
          { new: true }
        ).catch((e) => console.log(e));
        console.log("UserProfiles.liked_posts updated via remove");

        return res.status(200).json({
          data: {
            message: "Post and UserProfiles successfully updated!",
            post: updatedPost,
            profile: updatedProfile,
          },
        });
      }

      // "remove" command
      if (existingProfile.ok && command === "remove") {
        // remove UserProfiles._id from Post.likes
        const updatedPost = await Post.findOneAndUpdate(
          { _id: postId },
          { $pull: { likes: profileId } },
          { new: true }
        ).catch((e) => console.log(e));
        console.log("Post.likes updated via remove");

        // remove Post._id from UserProfiles.liked_posts
        const updatedProfile = await UserProfiles.findOneAndUpdate(
          { _id: profileId },
          { $pull: { liked_posts: updatedPost._id } },
          { new: true }
        ).catch((e) => console.log(e));
        console.log("UserProfiles.liked_posts updated via remove");

        return res.status(200).json({
          data: {
            message: "Post and UserProfiles successfully updated!",
            post: updatedPost,
            profile: updatedProfile,
          },
        });
      }

      return res.status(422).json({
        message: `could not find a user profile with id: ${profileId}...`,
      });
    }
    return res
      .status(422)
      .json({ message: "invalid data posted... please try again" });
  }

  // non-POST methods - returns the post without populated fields
  const foundPost = await Post.findById(postId).exec();
  return res.status(200).json(foundPost);
};

export async function verifyUserProfileExists(id) {
  const profileId = new mongoose.Types.ObjectId(id);
  const query = await UserProfiles.findById(profileId).exec();
  return { ok: Boolean(query), model: query };
}
