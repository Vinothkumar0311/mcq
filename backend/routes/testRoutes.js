// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const testController = require("../controllers/testController");
// const questionController = require("../controllers/questionController");

// const router = express.Router();

// // File storage for multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, `${Date.now()}_${file.originalname}`),
// });
// const upload = multer({ storage });
// const uploadMemory = multer(); // for buffer upload (in-memory)

// router.post("/createTest", upload.any(), testController.createTest);
// router.post("/uploadMCQ/:sectionId", uploadMemory.single("file"), questionController.uploadMCQQuestions);

// module.exports = router;



const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { uploadMultipleExcel } = require('../utils/fileUpload');

router.post(
  '/',
  uploadMultipleExcel,
  testController.createTest
);

module.exports = router;