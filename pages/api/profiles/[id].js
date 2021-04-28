import { connectToDatabase } from "../../../util/mongodb";
import UserProfiles from "../../../models/profileModel";
import Posts from "../../../models/postModel";
import Comments from "../../../models/commentModel";

/**
 * .../api/profiles/<UserProfile._id>
 * 
 * Retrieves a single UserProfile instance with "posts", "comments", &
 * "liked_posts" fields populated.
 *
 * TODO: Create a method to allow PATCH requests to update UserProfile instances.
 */
export default async (req, res) => {
  await connectToDatabase();

  const profileId = req.query.id;
  const singleProfile = await UserProfiles.findById(profileId)
    .populate("posts", "meta_title", Posts)
    .populate("comments", "message date_time", Comments)
    .populate("liked_posts", "meta_title", Posts)
    .exec();

  return res.status(200).json(singleProfile);
};
