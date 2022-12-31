import connectDB from "../../middleware/mongodb";
import User from "../../models/user.model.js";
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const aws = require("aws-sdk");

// configuring nodemailer with aws ses
let transporter = nodemailer.createTransport({
  SES: new aws.SES({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.SES_REGION,
    apiVersion: "2010-12-01",
  }),
});

const handler = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        status: "error",
        error: "Email does not exist in our database.",
      });
    }

    const token = jwt.sign(
      { username: user.username, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );
    const url_token = token.replace(/\./g, "%25dot%25");
    const link = `http://localhost:5173/reset-password/${url_token}`;

    // send email using nodemailer & aws ses
    transporter.sendMail(
      {
        from: "field.observers@gmail.com",
        to: req.body.email,
        subject: "field-observer Password Reset",
        text: `Here's your password reset link: ${link}. It will expire in 10 minutes.`,
      },
      (err) => {
        console.log(err);
      }
    );

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
