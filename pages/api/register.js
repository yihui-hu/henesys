import connectDB from '../../middleware/mongodb';
import User from '../../models/user.model.js';
const bcrypt = require('bcrypt');

const handler = async (req, res) => {
  try {
    const hashed_password = await bcrypt.hash(req.body.password, 10);

    await User.create({
      profile_pic: 'https://field-observer.s3.ca-central-1.amazonaws.com/default-profile-pic.jpg',
      username: req.body.username,
      email: req.body.email,
      password: hashed_password,
    });

    res.json({ status: "ok", message: "Successfully registered user." });
  } catch (err) {
    return res.json({ status: "error", error: err });
  }
}

export default connectDB(handler);