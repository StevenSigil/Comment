import mongoose from "mongoose";
import { connectToDatabase } from "./mongodb";
import UserProfiles from "../models/profileModel";

export async function verifyUserProfileExists(id) {
  await connectToDatabase();
  const profileId = new mongoose.Types.ObjectId(id);
  const query = await UserProfiles.findById(profileId).exec();

  return { ok: Boolean(query), model: query };
}
