const express = require("express");
const fileUploadRouter = express.Router();
const{ handleFileUpload }= require("../../controller/fileUpload/fileUpload");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const maxSize = 2 * 1024 * 1024; // 2 MB limit

const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: (req, file, cb) => {
    if (file.size > maxSize) {
      return cb(new Error('File size should not exceed 2 MB'));
    }
    cb(null, true);
  },
});

// Use the fileUploadController for the "/upload" route
fileUploadRouter.post("/upload",upload.single('file'), handleFileUpload);

module.exports = fileUploadRouter;

