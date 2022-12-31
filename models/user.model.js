const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    profile_pic: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "users" }
);

mongoose.models = {};

const User = mongoose.model("User", user);

export default User
