import { destroyCookie } from "nookies"

const handler = async (req, res) => {
  try {
    destroyCookie({ res }, 'fo_token', {path: '/'});
    res.send(200);
  } catch (err) {
    return res.json({
      status: "error",
      error: "Error signing out. Please try again later.",
    });
  }
};

export default handler;
