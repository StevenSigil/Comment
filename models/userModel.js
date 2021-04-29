import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({}, { strict: false });
// const User = mongoose.model("users", UserSchema, "users");

export default mongoose.models["users"] ||
  mongoose.model("users", UserSchema, "users");
