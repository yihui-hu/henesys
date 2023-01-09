import nookies from "nookies";
import jwt from "jsonwebtoken";

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.fo_token;

  let isLoggedIn = false;
  try {
    const user = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);
    if (user) {
        isLoggedIn = true;
    }
  } catch (err) {
    console.log(err);
  }

  return { props: { isLoggedIn: isLoggedIn } };
}
