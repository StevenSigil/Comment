import { connectToDatabase } from "../../../util/mongodb";
import UserProfiles from "../../../models/profileModel";
import Posts from "../../../models/postModel";
import Comments from "../../../models/commentModel";

/**
 * .../api/profiles
 *
 * API endpoint to:
 * - GET: retrieve ALL UserProfiles instances
 * - POST: Create a new UserProfile instance with a given UID (auth)
 *
 * Expecting request.body formate as:
 * {"base_user_id": "[UID (auth)]", "display_name":
 * "[VALIDATED-userInput]", "photo_url": "[UriToPhoto]"}
 *
 * All other methods are not allowed
 *
 * TODO: Create a pre-save on the UserProfiles model to catch and reject a
 * profile if one is already associated with a User._id
 */
export default async (req, res) => {
  await connectToDatabase();

  const method = req.method;

  if (method === "GET") {
    const listOfProfiles = await UserProfiles.find()
      .populate("posts", "meta_title", Posts)
      .populate("comments", "message date_time", Comments)
      .populate("liked_posts", "meta_title", Posts)
      .exec();

    return res.status(200).json(listOfProfiles);
  }

  if (method === "POST") {
    const { base_user_id, display_name, photo_url } = req.body;

    if (base_user_id && display_name) {
      try {
        const profile = new UserProfiles({
          base_user_id,
          display_name,
          photo_url, // assumes already saved to cdn before this model is created!
        });

        // ============================================================================== //
        // TODO: Create a pre-save on the UserProfiles model to catch and reject a
        // profile if one is already associated with a User._id!

        const createdProfile = await profile
          .save()
          .catch((e) => console.log(e));
        const returnedProfile = await UserProfiles.findById(createdProfile._id);

        return res.status(201).json(returnedProfile);
      } catch (error) {
        console.log("profiles/index.js: 42\n", error);
      }
    }
    return res
      .status(422)
      .json({ message: "Invalid data submitted. Profile was not save!" });
  }

  return res
    .status(422)
    .json({ message: `${method} request is not supported...` });
};
