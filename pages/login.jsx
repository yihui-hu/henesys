import { useState } from "react";
import { useRouter } from "next/navigation";
import { getServerSideProps } from "../lib/authStaticPages";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  async function loginUser(event) {
    event.preventDefault();
    setSuccessMsg("Logging you in...");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.status == "ok") {
      setErrorMsg("");
      setError(false);
      setSuccess(true);
      router.push("/home");
    } else {
      setPassword("");
      setErrorMsg(data.error);
      setError(true);
      setSuccess(false);
    }
  }

  return (
    <>
      <div className="auth-container">
        <div className="auth-nav" onClick={() => router.push("/")}>
          field-observer
        </div>
        <div className="auth-modal">
          <form onSubmit={loginUser}>
            <h4 className="auth-input-header">Email</h4>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4 className="auth-input-header">Password</h4>
              <a
                onClick={() => router.push("/forgot-password")}
                className="auth-forgot-password"
              >
                Forgot?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
            {error && <p className="auth-error-message">{errorMsg}</p>}
            {success && <p className="auth-success-message">{successMsg}</p>}
            <div className="auth-button-container">
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="auth-secondary-button"
              >
                Sign up instead
              </button>
              <input
                type="submit"
                value="Login"
                className="auth-primary-button"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export { getServerSideProps }
