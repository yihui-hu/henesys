import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jwt-decode";

const Profile = () => {
  const router = useRouter();

  const [validToken, setValidToken] = useState(false);

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    if (token) {
      const user = jwt(token);

      if (!user) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        setValidToken(true);
      }
      
    } else {
      router.push("/login");
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  function goHome() {
    window.location.href = "/home";
  }

  return (
    <>
      {validToken && (
        <>
          <h2>This is the profile page.</h2>
          <button onClick={logout}>Log out</button>
          <button onClick={goHome}>Go Home</button>
        </>
      )}
    </>
  );
};

export default Profile;
