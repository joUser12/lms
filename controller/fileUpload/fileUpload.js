// const multer = require('multer');
const asyncHandler = require("express-async-handler");

// exports.fileUpload = asyncHandler(async (req, res) => {
//     console.log(req.file);
//     try {
//         await uploadFile(req, res);

//         if (req.file == undefined) {
//             return res.status(400).send({ message: "Please upload a file!" });
//         }

//         res.status(200).send({
//             message: "Uploaded the file successfully: " + req.file.originalname,
//         });
//     } catch (err) {
//         res.status(500).send({
//             message: `Could not upload the file: ${req.file.originalname}. ${err}`,
//         });
//     }
// })

// exports.fileUploads = (req, res) => {
//     if (req.file) {
//       const filePath = req.file.filename;
//       const fileUrl = `http://localhost:4000/file/${filePath}`; // Update with your server's URL
//       console.log('File uploaded successfully. URL:', fileUrl);
//       res.json({ message: 'File uploaded successfully', fileUrl });
//     } else if (req.fileValidationError) {
//       res.status(400).json({ error: req.fileValidationError });
//     } else {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   };


exports.handleFileUpload = (req, res, next) => {
  try {
    if (req.file) {
      const filePath = req.file.filename;
      // const fileUrl = `http://localhost:4000/file/${filePath}`; // Update with your server's URL
      const imageUrl = req.protocol + '://' + req.get('host') + '/file/' + filePath;
      res.json({ message: 'File uploaded successfully', imageUrl });
    } else if (req.fileValidationError) {
      throw new Error(req.fileValidationError);
    } else {
      throw new Error('Internal server error');
    }
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};
