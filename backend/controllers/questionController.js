const { MCQ } = require("../models");
const parseMCQExcel = require("../utils/parseMCQExcel");

exports.uploadMCQQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const sectionId = req.params.sectionId;
    const questions = parseMCQExcel(req.file.buffer, true);

    const insertPromises = questions.map((q) =>
      MCQ.create({
        sectionId,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
        marks: q.marks,
      })
    );

    await Promise.all(insertPromises);

    res.status(201).json({
      success: true,
      message: `${questions.length} questions added successfully`,
    });
  } catch (error) {
    console.error("Error uploading questions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload questions",
    });
  }
};
