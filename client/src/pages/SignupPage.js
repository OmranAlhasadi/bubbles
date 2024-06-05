import styles from "../css/SignupPage.module.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

import { toast } from "react-toastify";

import { CircleLoader } from "react-spinners";

const SignupPage = () => {
  const { signupUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isSigningUp, setIsSigningUp] = useState(false);

  const navigateToLogin = () => {
    navigate("/login");
  };

  const validateFields = () => {
    let isValid = true;

    //empty fields validation

    if (!name.trim()) {
      setNameError("Name cannot be empty.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!username.trim()) {
      setUsernameError("Username cannot be empty.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!email.trim()) {
      setEmailError("Email cannot be empty.");
      isValid = false;
    } else {
      setEmailError("");
    }

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

    //format validation

    // password match validation
    if (password !== confirmPassword) {
      setConfirmPasswordError("Confirm Password must match Password.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError("Invalid email format.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password length validation
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      setIsSigningUp(true);

      try {
        const success = await signupUser({ username, name, email, password });

        if (success) {
          toast.success(
            "Verification link sent to your email please verify so you can login"
          );

          navigate("/");
        } else {
          toast.error(
            "Error Signingup/sending verification link to email gagagagaga"
          );
        }
      } catch (error) {
        toast.error("Error Signingup/sending verification link to email");
      } finally {
        setIsSigningUp(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form
          className={`${styles.form} ${isSigningUp ? "disabled" : ""}`}
          onSubmit={handleSignup}
        >
          <div className={styles.fieldContainer}>
            <label className={styles.fieldLabel} htmlFor="name">
              Full name
            </label>
            <input
              className={styles.inputField}
              name="name"
              placeholder="Enter full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <div className={styles.errorMsg}>{nameError}</div>}
          </div>
          <div className={styles.fieldContainer}>
            <label className={styles.fieldLabel} htmlFor="username">
              Username
            </label>
            <input
              className={styles.inputField}
              name="username"
              placeholder="Enter username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && (
              <div className={styles.errorMsg}>{usernameError}</div>
            )}
          </div>
          <div className={styles.fieldContainer}>
            <label className={styles.fieldLabel} htmlFor="email">
              Email
            </label>
            <input
              className={styles.inputField}
              name="email"
              placeholder="Enter email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className={styles.errorMsg}>{emailError}</div>}
          </div>
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
          <button className={styles.formButton} type="submit">
            {isSigningUp ? (
              <CircleLoader size="20px" color="#c084fc" />
            ) : (
              "Sign Up"
            )}
          </button>
          <button
            type="button"
            className={styles.loginButton}
            onClick={navigateToLogin}
          >
            Already a user? Login!
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
