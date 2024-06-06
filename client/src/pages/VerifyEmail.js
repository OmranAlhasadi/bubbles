import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import styles from "../css/VerifyEmail.module.css";

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState("verifying");
  const isFetching = useRef(false);

  useEffect(() => {
    const verifyEmail = async (token) => {
      if (isFetching.current) return; // Prevent multiple requests

      isFetching.current = true;
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/verify-email?token=${token}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to verify email");
        }

        setMessage(data.message);
        setStatus("success");
        toast.success(data.message);
      } catch (error) {
        setMessage(
          error.message ||
            "Failed to verify email. Please try the process again."
        );
        setStatus("error");
        toast.error(
          error.message ||
            "Failed to verify email. Please try the process again."
        );
      } finally {
        isFetching.current = false; // Reset the fetching state
      }
    };

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      verifyEmail(token);
    } else {
      setMessage("Invalid or expired link.");
      setStatus("error");
    }
  }, [location]);

  return (
    <div className={styles.container}>
      {status === "verifying" && <p>{message}</p>}
      {status === "success" && (
        <div className={styles.successContainer}>
          <svg
            className={styles.checkmark}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className={styles.checkmarkCircle}
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className={styles.checkmarkCheck}
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
          <p className={styles.resetMsg} style={{ color: "#28a745" }}>
            Email Verified!
          </p>
          <button
            onClick={() => navigate("/login")}
            className={styles.formButton}
          >
            Go to Login
          </button>
        </div>
      )}
      {status === "error" && (
        <div className={styles.errorContainer}>
          <svg
            className={styles.cross}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className={styles.crossCircle}
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className={styles.crossPath}
              fill="none"
              d="M16 16 36 36 M36 16 16 36"
            />
          </svg>
          <p className={styles.resetMsg} style={{ color: "#dc3545" }}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
