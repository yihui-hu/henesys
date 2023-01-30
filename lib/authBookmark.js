import mongoose from "mongoose";
import nookies from "nookies";
import jwt from "jsonwebtoken";
import Bookmark from "../models/bookmark.model"
import { redirect } from "next/dist/server/api-utils";

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.fo_token;
  const id = ctx.params.bookmarkId;

  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.FO_DATABASE_URL);

  let isLoggedIn = false;
  try {
    const user = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);
    if (user) {
        isLoggedIn = true;
    }
  } catch (err) {
    console.log(err);
  }

  const bookmark = await Bookmark.findById(id);

  if (bookmark == null) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }

  return { props: { isLoggedIn: isLoggedIn, bookmarkData: JSON.stringify(bookmark) } };
}
