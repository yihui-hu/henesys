import { useState } from "react";
import { useRouter } from "next/navigation";
import { getServerSideProps } from "../lib/authStaticPages";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  async function registerUser(event) {
    event.preventDefault();

    const res = /^[a-zA-Z0-9_]{2,}[a-zA-Z]+[0-9]*$/.exec(username);
    const validUsername = !!res;

    if (!validUsername || username.length < 3) {
      displayErrorMsg(
        "Username must be more than 3 characters and contain at least one letter (a-z / A-Z). Other valid characters include numbers (0-9)."
      );
      return;
    }

    if (password.length < 8) {
      displayErrorMsg("Password must be at least 8 characters.");
      return;
    } else if (password != confirmPassword) {
      displayErrorMsg("Passwords do not match.");
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.status == "ok") {
      displaySuccessMsg(data.message);
    } else {
      displayErrorMsg(data.error);
    }
  }

  function displayErrorMsg(error) {
    setErrorMsg(error);
    setError(true);
    setSuccessMsg("");
    setSuccess(false);
    setPassword("");
    setConfirmPassword("");
  }

  function displaySuccessMsg(message) {
    setSuccessMsg(message);
    setSuccess(true);
    setError(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-nav" onClick={() => router.push("/")}>
        henesys
      </div>
      <div className="auth-modal">
        <form onSubmit={registerUser}>
          <h4 className="auth-input-header">Username</h4>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            required
            className="auth-input"
          />
          <h4 className="auth-input-header">Email</h4>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <h4 className="auth-input-header">Password</h4>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <h4 className="auth-input-header">Confirm password</h4>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="auth-input"
          />
          {error && <p className="auth-error-message">{errorMsg}</p>}
          {success && <p className="auth-success-message">{successMsg}</p>}
          <div className="auth-button-container">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="auth-secondary-button"
            >
              Login instead
            </button>
            <input
              type="submit"
              value="Register"
              className="auth-primary-button"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export { getServerSideProps };
