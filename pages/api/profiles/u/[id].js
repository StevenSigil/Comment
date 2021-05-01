import { connectToDatabase } from "../../../../util/mongodb";
import UserProfiles from "../../../../models/profileModel";
import Posts from "../../../../models/postModel";
import Comments from "../../../../models/commentModel";

/**
 * .../api/profiles/u/<User._id> (auth ID)
 *
 * API endpoint to retrieve a single, populated UserProfile instance give a
 * UID (from auth collection)
 *
 * All request methods return the same.
 */
export default async (req, res) => {
  await connectToDatabase();

  const uid = req.query.id;
  const singleProfile = await UserProfiles.findOne({ base_user_id: uid })
    .populate("posts", "meta_title", Posts)
    .populate("comments", "message date_time", Comments)
    .populate({
      path: "liked_posts",
      select: "post",
      populate: {
        path: "post",
        model: Posts,
      },
    })
    .exec();

  return res.status(200).json(singleProfile);
};
