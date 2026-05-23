// multer.js

import multer from "multer";

const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const proofTypes = [...imageTypes, "application/pdf"];

const createUpload = (allowedTypes, message) => multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error(message);
      err.status = 400;
      cb(err, false);
    }
  },
});

export const upload = createUpload(imageTypes, "Only JPG, PNG, and WEBP images allowed");
export const campaignUpload = createUpload(proofTypes, "Only JPG, PNG, WEBP, and PDF files allowed");
