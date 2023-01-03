import nookies from "nookies";
import jwt from "jsonwebtoken";

export async function getServerSideProps(ctx) {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=1800, stale-while-revalidate=86400"
  );
  
  const cookies = nookies.get(ctx);
  const token = cookies.fo_token;

  let user;
  try {
    user = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);
  } catch (err) {
    console.log(err);
  }

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return { props: { token, profile_pic: user.profile_pic } };
}
