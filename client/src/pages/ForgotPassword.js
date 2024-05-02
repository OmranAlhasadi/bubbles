import styles from "../css/LoginPage.module.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import logo from "../images/logo-white.png";

const ForgotPassword = () => {
  const { forgotPassword } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateFields = () => {
    let isValid = true;

    //empty fields validation

    if (!email.trim()) {
      setEmailError("Email cannot be empty.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError("Invalid email format.");
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      console.log(email);
      const success = await forgotPassword(email);
      if (success) {
        console.log("Password request sent to email");
      } else {
        console.log("Error Sending request");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <img src={logo} className={styles.logo} />
        </div>
        <form className={styles.form} onSubmit={handleForgotPassword}>
          <div className={styles.fieldContainer}>
            <label className={styles.fieldLabel} htmlFor="email">
              Email
            </label>
            <input
              className={styles.inputField}
              name="email"
              placeholder="Enter e-mail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className={styles.errorMsg}>{emailError}</div>}
          </div>

          <button className={styles.formButton} type="submit">
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
