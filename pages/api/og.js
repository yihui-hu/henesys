import { ImageResponse } from "@vercel/og";
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
          fontSize: 64,
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
            fontSize: 32,
            width: "560px",
            height: "640px",
          }}
        >
          <div>henesys</div>
          {title != "null" && (
            <div
              style={{
                display: "flex",
                width: "300px !important",
                fontSize: 48,
                marginTop: -200,
                overflow: "hidden",
                textOverflow: "ellipsis",
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
            fontSize: 32,
            width: "640px",
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
                padding: 96,
                marginTop: -24,
                width: "640px",
                height: "664px",
                overflow: "hidden",
              }}
            >
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum."
              <div
                style={{
                  width: "640px",
                  height: "200px",
                  backgroundImage: `linear-gradient(
                  to bottom,
                  rgba(255, 255, 255, 0.2),
                  rgba(255, 255, 255, 0.85),
                  rgba(255, 255, 255, 1),
                  rgba(255, 255, 255, 1) 100%
                )`,
                  marginTop: -382,
                  marginLeft: -96,
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
