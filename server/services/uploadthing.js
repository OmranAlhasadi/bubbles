const { createUploadthing } = require("uploadthing/express");
const authMiddleware = require("../middlewares/authMiddleware");

const f = createUploadthing();

const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      return {};
    })
    .onUploadComplete((data) => {
      /* console.log("upload completed", data); */
    }),
};

module.exports = { uploadRouter };
