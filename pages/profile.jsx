import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { destroyCookie } from 'nookies'
import nookies from "nookies";
import jwt from "jsonwebtoken";

export default function Profile({ token, user }) {
  const router = useRouter();

  useEffect(() => {

  }, []);

  function logout() {
    destroyCookie(null, "fo_token");
    router.push("/");
  }

  function goHome() {
    router.push("/home");
  }

  return (
    <>
      <h2>This is the profile page.</h2>
      <button onClick={logout}>Log out</button>
      <button onClick={goHome}>Go Home</button>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.fo_token;

  let user;
  try {
    user = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);
  } catch (err) {
    console.log(err);
  }

  if (!user) {
    nookies.destroy(ctx, "fo_token");
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return { props: { token, user } };
}
