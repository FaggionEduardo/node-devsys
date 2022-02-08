const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "..", "tmp", "uploads"));
  },
  filename: (req, file, cb) => {
    const filename = crypto.randomBytes(16).toString("hex");
    const extensionFile = file.originalname.slice(
      file.originalname.lastIndexOf(".")
    );
    cb(null, `${filename}${extensionFile}`);
  },
});
module.exports = {
  storage: multerConfig,
};
