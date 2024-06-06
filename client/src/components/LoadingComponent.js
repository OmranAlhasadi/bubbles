import { useState, useEffect } from "react";
import styles from "../css/LoadingComponent.module.css";

const LoadingComponent = ({
  loaderType = "Dot",
  loaderSize = "20px",
  loaderColor = "#c084fc",
  text = "",
}) => {
  const [Loader, setLoader] = useState(null);

  useEffect(() => {
    import(`react-spinners/${loaderType}Loader`)
      .then((module) => {
        setLoader(() => module.default);
      })
      .catch((err) => {
        console.error(`Error loading ${loaderType}Loader`, err);
      });
  }, [loaderType]);

  if (!Loader) return <div>{text}</div>;

  return (
    <div className={styles.loaderContainer}>
      <span className={styles.loaderText}>{text}</span>
      <Loader size={loaderSize} color={loaderColor} />
    </div>
  );
};

export default LoadingComponent;
