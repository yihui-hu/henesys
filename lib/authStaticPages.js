import nookies from "nookies";
import jwt from "jsonwebtoken";

export async function getServerSideProps(ctx) {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=1800, stale-while-revalidate=86400"
  );

  const cookies = nookies.get(ctx);
  const token = cookies.fo_token;

  try {
    let user = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);

    if (user) {
      return {
        redirect: {
          permanent: false,
          destination: "/home",
        },
      };
    }
  } catch (err) {
    console.log("Invalid token.");
  }

  return { props: {} };
}
