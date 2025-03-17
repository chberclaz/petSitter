// This is a simplified version for local development
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadDir = path.join(__dirname, "../../uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Upload a file to local storage (simulating S3)
 * @param {Object} file - The file object from multer
 * @param {String} pathPrefix - The path prefix for the file
 * @returns {Promise<String>} - The URL of the uploaded file
 */
const uploadToS3 = async (file, pathPrefix) => {
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = path.join(uploadDir, pathPrefix);

  // Ensure directory exists
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }

  const fullPath = path.join(filePath, fileName);

  return new Promise((resolve, reject) => {
    fs.writeFile(fullPath, file.buffer, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Return a URL-like path
      resolve(`/uploads/${pathPrefix}/${fileName}`);
    });
  });
};

module.exports = { uploadToS3 };
