import mongoose from "mongoose";

// const { MONGODB_URI, MONGODB_DB } = process.env;
const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    console.log("reusing mongo cached connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("attempting to open a connection to mongoDB");
    const opts = {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useNewUrlParser: true,
    };

    cached.promise = await mongoose
      .connect(MONGODB_URI, opts)
      .catch((error) => console.log(error));
  }

  cached.conn = await cached.promise;
  console.log(cached.conn.client);
  return cached.conn;
}
