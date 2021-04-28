// api/posts/<Post._id>
// Retrieves a specific Post instance

import { connectToDatabase } from "../../../../util/mongodb";
import Posts from "../../../../models/postModel";
import Comments from "../../../../models/commentModel";
import UserProfiles from "../../../../models/profileModel";

export default async (req, res) => {
  await connectToDatabase();

  const singlePost = await Posts.findById(req.query.id)
    .populate("posting_user", ["display_name", "photo_url"], UserProfiles)
    .populate("likes", ["display_name", "photo_url"], UserProfiles)
    .populate({
      path: "comments",
      select: "message date_time",
      populate: {
        path: "commenting_user",
        select: "display_name photo_url",
        model: UserProfiles,
      },
      model: Comments,
    })
    .exec();

  return res.status(200).json(singlePost);
};
