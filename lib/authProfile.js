import mongoose from "mongoose";
import nookies from "nookies";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.fo_token;

  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.FO_DATABASE_URL);

  let username;
  try {
    const user = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);
    if (user) {
      username = user.username;
    }
  } catch (err) {
    console.log(err);
  }

  const user = await User.findOne({ username: username });

  console.log(user);

  return { props: { user: JSON.stringify(user) } };
}
