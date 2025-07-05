const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const testController = require("../controllers/testController");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post(
  "/create",
  upload.fields([
    { name: "1", maxCount: 1 },
    { name: "2", maxCount: 1 },
    { name: "3", maxCount: 1 },
    { name: "4", maxCount: 1 },
    { name: "5", maxCount: 1 },
  ]),
  testController.createTest
);

module.exports = router;
