import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { destroyCookie } from 'nookies'; destroyCookie({}, 'access'); 
import nookies from "nookies";
import jwt from "jsonwebtoken";

export default function Profile({}) {
  const router = useRouter();

  async function logout() {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    await response.json();

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
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return { props: {} };
}
