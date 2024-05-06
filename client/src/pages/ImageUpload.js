// Import necessary modules from the react and uploadthing packages
import { useContext } from "react";
import { generateUploadButton } from "@uploadthing/react";
import { UserContext } from "../contexts/UserContext";

// Generate the UploadButton component using generateUploadButton function
// Assume your backend upload endpoint is set up at "/api/uploadthing" and handles "imageUploader" route.

const ImageUploadPage = () => {
  const { user, updateUser } = useContext(UserContext);

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

  const UploadButton = generateUploadButton({
    url: "http://localhost:3001/api/uploadthing",
  });

  return (
    <div>
      <h1>Upload Your Profile Picture</h1>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={handleClientUploadComplete}
        onUploadError={(error) => {
          console.error("Upload error:", error);
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
};

export default ImageUploadPage;
