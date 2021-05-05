import mongoose from "mongoose";
import User from "./userModel";

const profileSchema = mongoose.Schema({
  base_user_id: {
    // AuthUserID
    type: mongoose.Schema.Types.ObjectId, // TODO: Frontend to handle - token/cookie?
    ref: "users",
  },
  display_name: {
    type: String,
    required: true,
  },
  photo_url: {
    type: String,
    required: false,
  },
  posts: {
    // PostID
    type: [mongoose.Schema.Types.ObjectId],
    ref: "posts",
    required: false,
  },
  comments: {
    // CommentID
    type: [mongoose.Schema.Types.ObjectId],
    ref: "comments",
  },
  liked_posts: [
    {
      post: {
        // PostID
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
      date_time: { type: Date, default: Date.now },
    },
  ],
  liked_comments: [
    {
      comment: {
        // CommentID
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
      },
      date_time: { type: Date, default: Date.now },
    },
  ],
});

profileSchema.post("save", async function (doc) {
  // Add the UserProfile instance to User instance (to be retrieved on frontend)
  const updatedUser = await User.findOneAndUpdate(
    { _id: doc.base_user_id },
    { $set: { pid: doc._id } }
  )
    .exec()
    .catch((err) => console.log("profileModel-postSave: 43\n", err));

  if (updatedUser.ok)
    console.log("User instance updated with profile ID.\n", updatedUser);
});

export default mongoose.models["user_profiles"] ||
  mongoose.model("user_profiles", profileSchema);
