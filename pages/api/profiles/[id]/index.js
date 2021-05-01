import { connectToDatabase } from "../../../../util/mongodb";
import UserProfiles from "../../../../models/profileModel";
import Posts from "../../../../models/postModel";
import Comments from "../../../../models/commentModel";

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

  // .populate("posts", "meta_title upload_date", Posts, {
  //   options: { sort: { upload_date: -1 } },
  // })

  const profileId = req.query.id;
  const singleProfile = await UserProfiles.findById(profileId)
    .populate({
      path: "posts",
      select: "meta_title upload_date",
      model: Posts,
      options: { sort: { upload_date: -1 } },
    })
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
