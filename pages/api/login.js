import connectDB from "../../middleware/mongodb";
import User from "../../models/user.model.js";
import nookies from "nookies";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        status: "error",
        error: "No account associated with that email.",
      });
    }

    // if (user.password == process.env.FO_WAITLIST_PASSWORD) {
    //   return res.json({
    //     status: "error",
    //     error: "Hang tight, you'll be let in shortly!",
    //   });
    // }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (validPassword) {
      const token = jwt.sign(
        {
          profile_pic: user.profile_pic,
          username: user.username,
        },
        process.env.FO_JWT_SECRET_KEY
      );

      nookies.set({ res }, "fo_token", token, {
        secure: true,
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60,
        path: "/",
      });

      return res.json({ status: "ok", message: "Successfully logged in." });
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
