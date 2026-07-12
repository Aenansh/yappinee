import mongoose from "mongoose";

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}
let cached = global.mongoose;

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        return mongoose.connection;
      });
  }

  try {
    cached.conn = await cached.promise;
    if (!cached.conn) throw new Error("Failed to connect to the database!");
  } catch (error) {
    cached.conn = null;
    cached.promise = null;
    console.log("Failed to connect to db", error);
    process.exit(0);
  } 
};
