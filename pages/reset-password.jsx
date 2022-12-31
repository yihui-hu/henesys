import { React, useState } from "react";
import { useRouter } from 'next/router'

const ResetPassword = () => {
  const router = useRouter();
  const { token_url } = router.query;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState("");

  function displayError(error) {
    setErrorMsg(error);
    setError(true);
    setResetSuccess(false);
    setPassword("");
    setConfirmPassword("");
  }

  async function resetPassword(event) {
    event.preventDefault();

    if (password.length < 8) {
      displayError("Password must be at least 8 characters.");
      return;
    } else if (password != confirmPassword) {
      displayError("Password do not match.");
      return;
    }

    const token = token_url.replace(/%dot%/g, '.');

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "x-access-token" : token,
      },
      body: JSON.stringify({
        email, password
      })
    })

    const data = await res.json();

    if (data.status == 'ok') {
      setResetSuccessMsg(data.message);
      setResetSuccess(true);
      setError(false);
    } else {
      setErrorMsg(data.error);
      setError(true);
      setResetSuccess(false);
    }

    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="auth-container">
      <div className="auth-nav" onClick={() => router.push("/")}>
        field-observer
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
          <h4 className="auth-input-header">Set new password</h4>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <h4 className="auth-input-header">Confirm new password</h4>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="auth-input"
          />
          { error && <p className="auth-error-message">{errorMsg}</p> }
          { resetSuccess && <p className="auth-success-message">{resetSuccessMsg}</p> }
          { resetSuccess && <button type="button" onClick={() => router.push("/login")} className="auth-secondary-button">Go to login</button> }
          { !resetSuccess && <input type="submit" value="Reset password" className="auth-primary-button"/> }
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
