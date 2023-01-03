import connectDB from "../../middleware/mongodb";
import User from "../../models/user.model.js";
const aws = require("aws-sdk");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// configuring nodemailer with aws ses
let transporter = nodemailer.createTransport({
  SES: new aws.SES({
    accessKeyId: process.env.FO_AWS_ACCESS_KEY,
    secretAccessKey: process.env.FO_AWS_SECRET,
    region: process.env.FO_SES_REGION,
    apiVersion: "2010-12-01",
  }),
});

const handler = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        status: "error",
        error: "No account associated with that email.",
      });
    }

    if (user.password == process.env.FO_WAITLIST_PASSWORD) {
      return res.json({
        status: "error",
        error: "Your account is still on the wailist.",
      });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.FO_JWT_SECRET_KEY,
      { expiresIn: "10m" }
    );

    const link = `https://field-observer-next.vercel.app/reset-password/${token}`;

    // send email using nodemailer & aws ses
    try {
      transporter.sendMail(
        {
          from: "field.observers@gmail.com",
          to: req.body.email,
          subject: "field-observer Password Reset",
          text: `Here's your password reset link: \n\n ${link}. \n\n It will expire in 10 minutes.`,
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (err) {
      return res.json({ status: "error", message: "Error sending password reset link. Please try again later." });
    }

    return res.json({
      status: "ok",
      message: "Password reset link has been sent to your email.",
    });
  } catch (err) {
    return res.json({
      status: "error",
      error: "Something went wrong. Please try again later.",
    });
  }
};

export default connectDB(handler);
