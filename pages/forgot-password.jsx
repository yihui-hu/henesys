import { useState } from "react";
import { useRouter } from 'next/navigation';
import { getServerSideProps } from "../lib/authStaticPages";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState("");

  async function resetPassword(event) {
    event.preventDefault();

    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    if (data.status == "ok") {
      setResetSuccessMsg(data.message);
      setResetSuccess(true);
      setError(false);
    } else {
      setErrorMsg(data.error);
      setError(true);
      setResetSuccess(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-nav" onClick={() => router.push("/")}>
        henesys
      </div>
      <div className="auth-modal">
        <form onSubmit={resetPassword}>
          <h4 className="auth-input-header">Email</h4>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          { error && <p className="auth-error-message">{errorMsg}</p> }
          { resetSuccess && <p className="auth-success-message">{resetSuccessMsg}</p> }
          <div className="auth-button-container">
            <button type="button" onClick={() => router.push("/login")} className="auth-secondary-button">Back to login</button>
            { !resetSuccess && <input type="submit" value="Reset password" className="auth-primary-button"/> }
          </div>
        </form>
      </div>
    </div>
  );
}

export { getServerSideProps };
