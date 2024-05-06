// Import necessary modules from the react and uploadthing packages
import React from "react";
import { generateUploadButton } from "@uploadthing/react";

// Generate the UploadButton component using generateUploadButton function
// Assume your backend upload endpoint is set up at "/api/uploadthing" and handles "imageUploader" route.
const UploadButton = generateUploadButton({
  url: "http://localhost:3001/api/uploadthing", // Adjust the URL based on where your backend is hosted
  credentials: "include",
});

const ImageUploadPage = () => {
  // Function to handle the completion of the upload
  const handleUploadComplete = (response) => {
    console.log("Upload complete:", response);
    if (response.success) {
      alert("Upload completed successfully!");
    } else {
      alert("Upload failed: " + response.message);
    }
  };

  // Function to handle errors during the upload
  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    alert("Upload failed!");
  };

  // Render the UploadButton in your component
  return (
    <div>
      <h1>Upload Your Profile Picture</h1>
      <UploadButton
        endpoint="imageUploader" // This should match the route name defined in your UploadThing configuration
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
        onUploadBegin={(name) => {
          // Do something once upload begins
          console.log("Uploading: ", name);
        }}
      />
    </div>
  );
};

export default ImageUploadPage;
