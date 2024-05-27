import { useContext, useState, useMemo } from "react";
import { generateUploadButton } from "@uploadthing/react";
import { UserContext } from "../contexts/UserContext";
import TextBox from "../components/TextBox";

import "@uploadthing/react/styles.css";

import styles from "../css/SettingsPage.module.css";

const SettingsPage = () => {
  const { user, updateUser } = useContext(UserContext);
  const [text, setText] = useState(user.aboutMe ? user.aboutMe : "");

  const handleClientUploadComplete = async (res) => {
    console.log("Files: ", res);
    console.log(res[0].url);
    if (res[0].url) {
      try {
        const response = await fetch(
          "http://localhost:3001/api/user/update-profile-picture",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ imageUrl: res[0].url }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          console.log("haaaaaaaaaaaaaaaaaaaa");
          console.log(data.user);
          updateUser(data.user); // Update user context with new user data
          alert("Profile picture updated successfully!");
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Failed to update profile picture:", error);
        alert("Failed to update profile picture.");
      }
    } else {
      alert("Upload completed, but no image URL returned.");
    }
  };

  const UploadButton = useMemo(
    () =>
      generateUploadButton({
        url: "http://localhost:3001/api/uploadthing",
      }),
    []
  );

  const handleAboutMe = async () => {
    try {
      const aboutBody = {
        content: text,
      };

      const response = await fetch(
        "http://localhost:3001/api/user/update-about-me",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(aboutBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateUser(data.user);
    } catch (error) {
      console.error("error updating aboutMe", error);
    }
  };

  /* const uploadSVG = (
    <svg className={styles.uploadSVG} viewBox="0 0 16 16">
      <path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
      <path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1z" />
    </svg>
  ); */

  return (
    <div className={styles.container}>
      <div className={styles.settingsContainer}>
        <div className={styles.profileContainer}>
          <img className={styles.profile} src={user.profileImg}></img>
          <UploadButton
            endpoint="imageUploader"
            className={styles.uploadButton}
            onClientUploadComplete={handleClientUploadComplete}
            onUploadError={(error) => {
              console.error("Upload error:", error);
              alert(`ERROR! ${error.message}`);
            }}
            /* content={{
              button({ ready }) {
                if (ready) return uploadSVG;

                return "Getting ready...";
              },
            }} */
          />
        </div>
        <div className={styles.aboutMeContainer}>
          <h1 className={styles.abtMeHeader}>Update About Me</h1>
          <form className={styles.abtMeFormContainer} onSubmit={handleAboutMe}>
            <textarea
              className={styles.textBox}
              placeholder={text}
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button className={styles.abtMeButton} type="submit">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
