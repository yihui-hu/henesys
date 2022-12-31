import connectDB from "../../middleware/mongodb";
import User from "../../models/user.model.js";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const hashed_new_password = await bcrypt.hash(req.body.password, 10);
    const decoded_token = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);

    if (decoded_token.email != req.body.email) {
      return res.json({ status: "error", error: "Invalid email." });
    }

    await User.findOneAndUpdate(
      { email: decoded_token.email },
      { password: hashed_new_password }
    );

    return res.json({ status: "ok", message: "Successfully reset password." });
  } catch (err) {
    return res.json({
      status: "error",
      error: "Password reset link is invalid / has expired.",
    });
  }
};

export default connectDB(handler);
