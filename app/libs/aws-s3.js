const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

// Configure AWS
aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

// Set up Multer for handling file uploads to S3
exports.uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "punit-images",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});
