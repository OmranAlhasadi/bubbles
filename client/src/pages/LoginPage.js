import styles from "../css/LoginPage.module.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import logo from "../images/logo-white.png";

import { toast } from "react-toastify";

import { CircleLoader } from "react-spinners";

const LoginPage = () => {
  const { loginUser, loginExampleUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingInExample, setIsLoggingInExample] = useState(false);

  const navigateToSignUp = () => {
    navigate("/signup");
  };

  const navigateToForgotPassword = () => {
    navigate("/forgot-password");
  };

  const validateFields = () => {
    let isValid = true;

    //empty fields validation

    if (!username.trim()) {
      setUsernameError("Username cannot be empty.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password.trim()) {
      setPasswordError("Password cannot be empty.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      setIsLoggingIn(true);

      try {
        const success = await loginUser(username, password);
        if (success) {
          toast.success("Logged in successfully!");
          navigate("/");
        } else {
          toast.error("Error logging in");
        }
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  const handleExampleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingInExample(true);

    try {
      const success = await loginExampleUser();
      if (success) {
        toast.success("Logged in successfully!");
        navigate("/");
      } else {
        toast.error("Error logging in");
      }
    } catch (e) {
      toast.error(e.message || "Error logging in");
    } finally {
      setIsLoggingInExample(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <img src={logo} className={styles.logo} />
        </div>
        <form
          className={`${styles.form} ${
            isLoggingIn || isLoggingInExample ? "disabled" : ""
          }`}
          onSubmit={handleLogin}
        >
          <div className={styles.fieldContainer}>
            <label className={styles.fieldLabel} htmlFor="username">
              Username or E-mail
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
          <button
            className={`${styles.formButton} ${isLoggingIn ? "disabled" : ""}`}
            type="submit"
          >
            {isLoggingIn ? (
              <CircleLoader size="20px" color="#c084fc" />
            ) : (
              "Log In"
            )}
          </button>
          <button
            type="button"
            className={styles.forgotButton}
            onClick={navigateToForgotPassword}
          >
            forgot your password?
          </button>
          <button
            type="button"
            className={styles.formButton}
            onClick={handleExampleLogin}
          >
            {isLoggingInExample ? (
              <CircleLoader size="20px" color="#c084fc" />
            ) : (
              "Log in as Example User"
            )}
          </button>
          <button
            type="button"
            className={styles.formButton}
            onClick={navigateToSignUp}
          >
            Sign Up with Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
