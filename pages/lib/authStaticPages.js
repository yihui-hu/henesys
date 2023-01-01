import nookies from "nookies";
import jwt from "jsonwebtoken";

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.fo_token;

  let user;
  try {
    user = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);
  } catch (err) {
    console.log("Invalid token.");
  }

  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: "/home",
      },
    };
  }

  return { props: {} };
}
