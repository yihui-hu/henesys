import connectDB from '../../middleware/mongodb';
import User from '../../models/user.model.js';
const aws = require("aws-sdk");
const bcrypt = require("bcrypt");
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
    const hashed_password = await bcrypt.hash(req.body.password, 10);
    const default_profile_pic = 'https://field-observer.s3.ca-central-1.amazonaws.com/default-profile-pic.jpg';

    await User.create({
      profile_pic: default_profile_pic,
      username: req.body.username,
      email: req.body.email,
      password: hashed_password,
    });

    try {
      transporter.sendMail(
        {
          from: "field.observers@gmail.com",
          to: "yyihui.hu@gmail.com",
          subject: "field-observer New User Signup",
          text: `New user sign up! \n Username: ${req.body.username} \n Email: ${req.body.email} \n Hashed password: ${hashed_password} \n`,
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (err) {
      return res.json({ status: "error", message: "Error signing up. Please try again later." });
    }

    res.json({ status: "ok", message: "" });
  } catch (err) {
    if (err.keyPattern.username == 1) {
      return res.json({ status: "error", error: "Username already in use." });
    } else if (err.keyPattern.email == 1) {
      return res.json({ status: "error", error: "Email already in use." });
    } else {
      return res.json({ status: "error", error: "Error signing up. Please try again later." });
    }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4.5mb",
    },
  },
};

export default connectDB(handler);