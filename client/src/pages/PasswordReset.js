import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../css/PasswordReset.module.css";

function PasswordReset() {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const validateFields = () => {
    let isValid = true;

    //empty fields validation

    if (!password.trim()) {
      setPasswordError("Password cannot be empty.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Confirm Password cannot be empty.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // password match validation
    if (password !== confirmPassword) {
      setConfirmPasswordError("Confirm Password must match Password.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateFields()) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/auth/reset-password/${token}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          }
        );
        if (response.ok) {
          setIsResetSuccessful(true); // Set success state
        } else {
          throw new Error("Failed to reset password");
        }
      } catch (error) {
        setPasswordError(
          "Failed to reset password, please check network connection and try again."
        );
      }
    }
  };

  if (isResetSuccessful) {
    return (
      <div className={styles.container}>
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
          <p className={styles.resetMsg}>Password successfully changed!</p>
          <button
            onClick={() => navigate("/login")}
            className={styles.formButton}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel} htmlFor="password">
            Password
          </label>
          <input
            className={styles.inputField}
            name="password"
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
            <div className={styles.errorMsg}>{passwordError}</div>
          )}
        </div>
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel} htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            className={styles.inputField}
            name="confirmPassword"
            placeholder="Re-enter password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPasswordError && (
            <div className={styles.errorMsg}>{confirmPasswordError}</div>
          )}
        </div>
        <button type="submit" className={styles.formButton}>
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default PasswordReset;
