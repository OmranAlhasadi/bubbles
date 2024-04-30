import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const EmailVerification = () => {
  const location = useLocation();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      fetch(`http://localhost:3001/api/auth/verify-email?token=${token}`)
        .then((res) => res.text())
        .then((data) => setMessage(data))
        .catch((err) =>
          setMessage("Failed to verify email. Please try the process again.")
        );
    } else {
      setMessage("Invalid or expired link.");
    }
  }, [location]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default EmailVerification;
