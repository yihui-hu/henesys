import connectDB from "../../middleware/mongodb";
import User from "../../models/user.model.js";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        status: "error",
        error: "Email does not exist in our database.",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (validPassword) {
      const token = jwt.sign(
        {
          profile_pic: user.profile_pic,
          username: user.username,
          email: user.email,
        },
        process.env.FO_FO_JWT_SECRET_KEY
      );

      return res.json({ status: "ok", token: token });
    } else {
      return res.json({ status: "error", error: "Incorrect password." });
    }
  } catch (err) {
    return res.json({
      status: "error",
      error: "Error logging in. Please try again later.",
    });
  }
};

export default connectDB(handler);
