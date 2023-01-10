import { ImageResponse } from "@vercel/og";
import { wrap } from "framer-motion";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

const handler = async (req) => {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username");
  const title = searchParams.get("title");
  const previewImg = searchParams.get("previewImg");
  const previewText = searchParams.get("previewText");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "",
          background: "white",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 30,
            fontSize: 27,
            width: "600px",
            height: "640px",
          }}
        >
          <div>henesys</div>
          {title != "null" && (
            <div
              style={{
                display: "flex",
                fontSize: 36,
                maxWidth: "520px",
                height: "300px",
                overflow: "hidden",
                whiteSpace: "no-wrap",
                textOverflow: "ellipsis",
                overflowWrap: "break-word",
              }}
            >
              <h4>{title}</h4>
            </div>
          )}
          <div style={{ display: "flex", color: "#acacac", fontSize: 24 }}>
            added by {username}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 27,
            width: "600px",
            height: "640px",
            borderLeft: "1px solid #dcdcdc",
          }}
        >
          {previewImg != "null" && (
            <img
              src={previewImg}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            ></img>
          )}
          {previewText != "null" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                paddingTop: 81,
                paddingLeft: 81,
                maxWidth: "504px",
                height: "664px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  overflowWrap: "break-word",
                }}
              >
                {previewText}
              </div>
              <div
                style={{
                  width: "600px",
                  height: "664px",
                  backgroundImage: `linear-gradient(
                    to bottom,
                    rgba(255, 255, 255, 0.2),
                    rgba(255, 255, 255, 0.85),
                    rgba(255, 255, 255, 1),
                    rgba(255, 255, 255, 1) 100%
                  )`,
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default handler;
