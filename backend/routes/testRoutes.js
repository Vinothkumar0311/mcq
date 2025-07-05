// // const express = require("express");
// // const multer = require("multer");
// // const path = require("path");
// // const testController = require("../controllers/testController");
// // const questionController = require("../controllers/questionController");

// // const router = express.Router();

// // // File storage for multer
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, "uploads/"),
// //   filename: (req, file, cb) =>
// //     cb(null, `${Date.now()}_${file.originalname}`),
// // });
// // const upload = multer({ storage });
// // const uploadMemory = multer(); // for buffer upload (in-memory)

// // router.post("/createTest", upload.any(), testController.createTest);
// // router.post("/uploadMCQ/:sectionId", uploadMemory.single("file"), questionController.uploadMCQQuestions);

// // module.exports = router;



// const express = require('express');
// const router = express.Router();
// const testController = require('../controllers/testController');
// const { uploadMultipleExcel } = require('../utils/fileUpload');

// router.post(
//   '/',
//   uploadMultipleExcel,
//   testController.createTest
// );

// module.exports = router;


const express = require("express");
const multer = require("multer");
const path = require("path");
const testController = require("../controllers/testController");

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to only accept Excel files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
      file.mimetype === "application/vnd.ms-excel") {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed!"), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  }
});

// Updated route to handle multiple files with dynamic field names
router.post(
  "/create",
  upload.any(), // Accept any files (will be available in req.files)
  testController.createTest
);

module.exports = router;