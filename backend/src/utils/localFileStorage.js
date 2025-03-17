const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

/**
 * Upload a file to local storage
 * @param {Object} file - The file object from multer
 * @param {String} pathPrefix - The path prefix for the file
 * @returns {Promise<String>} - The URL of the uploaded file
 */
const uploadToLocal = async (file, pathPrefix) => {
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const relativePath = path.join(pathPrefix, fileName);
  const absolutePath = path.join(process.env.UPLOAD_DIR, relativePath);

  // Ensure directory exists
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write file
  return new Promise((resolve, reject) => {
    fs.writeFile(absolutePath, file.buffer, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Return URL that can be used to access the file
      const fileUrl = `/uploads/${relativePath}`;
      resolve(fileUrl);
    });
  });
};

module.exports = { uploadToLocal };
