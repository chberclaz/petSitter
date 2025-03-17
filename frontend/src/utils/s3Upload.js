const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

/**
 * Upload a file to S3
 * @param {Object} file - The file object from multer
 * @param {String} path - The path prefix for the file in S3
 * @returns {Promise<String>} - The URL of the uploaded file
 */
const uploadToS3 = async (file, path) => {
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `${path}/${uuidv4()}.${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};

module.exports = { uploadToS3 };
