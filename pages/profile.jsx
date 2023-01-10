import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
destroyCookie({}, "access");
import { getServerSideProps } from "../lib/authProfile";
const dayjs = require('dayjs');

export default function Profile({ user }) {
  const router = useRouter();
  const userData = JSON.parse(user);

  async function logout() {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    await response.json();

    router.push("/");
  }

  return (
    <div className="profile-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="back-icon"
        onClick={() => router.back()}
      >
        <path
          fillRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z"
          clipRule="evenodd"
        />
      </svg>

      <div className="profile-user-container">
        <div className="profile-user-header">
          <div
            className="profile-pic"
            style={{ backgroundImage: `url(${userData.profile_pic})` }}
          />
          <div>
            <h4 className="profile-username">{userData.username}</h4>
            <h4 style={{color: "#acacac", fontWeight: 400}}>Joined {dayjs(userData.createdAt).format("MMM YYYY")}</h4>
          </div>
        </div>
        <div className="profile-button-container">
          <button className="profile-secondary-button">Delete account</button>
          <button onClick={logout} className="profile-primary-button">Log out</button>
        </div>
      </div>
    </div>
  );
}

export { getServerSideProps };
