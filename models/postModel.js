import mongoose from "mongoose";
import UserProfiles from "./profileModel";

const postSchema = mongoose.Schema({
  posting_user: {
    // UserProfileID
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_profiles",
  },
  original_url: {
    // the url a user is trying to share.
    type: String,
    required: true,
  },
  meta_title: {
    type: String,
    required: true,
  },
  meta_description: {
    type: String,
    required: true,
  },
  meta_image: {
    type: String,
    required: false,
  },
  meta_url: {
    type: String,
    required: false,
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "comments",
  },
  likes: {
    // UserProfileID
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user_profiles",
  },
  upload_date: {
    type: Date,
    default: Date.now,
  },
});

postSchema.post("save", async function (doc) {
  // add the post instance to a user's profile
  const profile = await UserProfiles.updateOne(
    { _id: doc.posting_user },
    { $addToSet: { posts: doc._id } }
  )
    .exec()
    .catch((e) => console.log("postModel: 53",e));

  if (profile.ok === 1) console.log("profile updated\n", profile);
});

export default mongoose.models["posts"] || mongoose.model("posts", postSchema);
