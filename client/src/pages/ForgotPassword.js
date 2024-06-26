import styles from "../css/LoginPage.module.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import logo from "../images/logo-white.png";

import { toast } from "react-toastify";
import { CircleLoader } from "react-spinners";

const ForgotPassword = () => {
  const { forgotPassword } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [requesting, setRequesting] = useState(false);

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
      setRequesting(true);

      try {
        const success = await forgotPassword(email);
        if (success) {
          toast.success("Password request sent to email");
        } else {
          toast.error("Error Sending request");
        }
      } catch (e) {
        toast.error(e.message || "Error Sending request");
      } finally {
        setRequesting(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <img src={logo} className={styles.logo} />
        </div>
        <form
          className={`${styles.form} ${requesting ? "disabled" : ""}`}
          onSubmit={handleForgotPassword}
        >
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
            {requesting ? (
              <CircleLoader size="20px" color="#c084fc" />
            ) : (
              "Send Request"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
