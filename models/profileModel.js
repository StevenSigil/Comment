import mongoose from "mongoose";

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
  liked_posts: {
    // PostID
    type: [mongoose.Schema.Types.ObjectId],
    ref: "posts",
  },
});

export default mongoose.models["user_profiles"] ||
  mongoose.model("user_profiles", profileSchema);
