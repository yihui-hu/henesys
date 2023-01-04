import { useState, useEffect } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import nookies from "nookies";
import jwt from "jsonwebtoken";
import Link from "next/link";
import Textarea from "react-textarea-autosize";
// import FullFilePreview from "../components/FullFilePreview";
// import FullUrlPreview from "../components/FullUrlPreview";
// import FullTextPreview from "../components/FullTextPreview";
const dayjs = require("dayjs");

export default function BookmarkFullView({ props }) {
  return <h4>Bookmark full view here.</h4>;
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.fo_token;
  const bookmark_id = ctx.params.id;

  let user = null;
  let loggedIn = false;
  let editable = false;
  let referer = ctx.req.headers.referer;
  let bookmarkFullViewData = null;

  try {
    user = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);
    if (user) {
      loggedIn = true;
    }
  } catch (err) {
    console.log("getServerSideProps - Not logged in.");
  }

  try {
    const res = await fetch("http://localhost:3000/api/get-bookmark-from-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookmark_id,
      }),
    });

    const data = await res.json();

    if (data.status == "ok") {
      bookmarkFullViewData = data.bookmark;
    } else {
      console.log(data.error)
    }

    if (user.username == bookmarkFullViewData.username) {
      editable = true;
    }
  } catch (err) {
    console.log(err);
  }

  console.log(referer)
  console.log(bookmarkFullViewData)
  console.log(loggedIn)
  console.log(editable)

  return {
    props: {
      referer,
      loggedIn,
      bookmarkFullViewData,
      editable,
    },
  };
}
