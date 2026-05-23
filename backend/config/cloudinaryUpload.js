// cloudinaryUpload.js

import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: options.folder || "crowdfund_uploads", resource_type: options.resourceType || "auto" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};
