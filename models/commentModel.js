import mongoose from "mongoose";
import UserProfiles from "./profileModel";
import Posts from "./postModel";

const commentSchema = mongoose.Schema({
  date_time: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    default: "",
  },
  image_url: {
    type: String,
    required: false,
  },
  commenting_user: {
    // UserProfileID
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_profiles",
  },
  post: {
    // PostID
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user_profiles",
  },
  replys: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "comments",
  },
  is_reply: {
    type: Boolean,
    default: false,
  },
});

commentSchema.post("save", async function (doc) {
  // Add the Comment to (parent) Post
  const parentPost = await Posts.updateOne(
    { _id: doc.post },
    { $addToSet: { comments: doc._id } }
  )
    .exec()
    .catch((e) => console.log("commentModel: 41", e));
  if (parentPost.ok === 1) {
    console.log("comment added to parent post!\n", parentPost);
  }

  // Add comment to posting users Profile
  const updateProfile = await UserProfiles.updateOne(
    { _id: doc.commenting_user },
    { $addToSet: { comments: doc.id } }
  )
    .exec()
    .catch((e) => console.log("commentModel: 52", e));

  if (updateProfile.ok === 1) {
    console.log("comment added to users profile\n", updateProfile);
  }
});

export default mongoose.models["comments"] ||
  mongoose.model("comments", commentSchema);
