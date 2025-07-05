const { Test, Section, MCQ, sequelize } = require("../models");
const generateTestId = require("../utils/generateTestId");
const parseExcel = require("../middlewares/upload"); // Fixed import
const fs = require("fs");
const path = require("path");

exports.createTest = async (req, res) => {
  const transaction = await sequelize.transaction();
  let file; // Declare file variable at the beginning
  
  try {
    console.log("========== NEW TEST CREATION REQUEST ==========");
    console.log("Received files:", req.files?.map(f => ({
      name: f.originalname,
      size: f.size,
      type: f.mimetype
    })));
    console.log("Received body:", req.body);

    if (!req.body.sections) {
      throw new Error("Sections data is required");
    }

    let sections;
    try {
      sections = typeof req.body.sections === 'string' 
        ? JSON.parse(req.body.sections) 
        : req.body.sections;
    } catch (err) {
      throw new Error("Invalid sections format: " + err.message);
    }

    const testId = await generateTestId();
    const test = await Test.create({ 
      testId, 
      name: req.body.name,
      description: req.body.description,
      instructions: req.body.instructions
    }, { transaction });

    console.log(`Created test with ID: ${testId}`);

    for (const [index, section] of sections.entries()) {
      console.log(`\nProcessing section ${index + 1}/${sections.length}:`, {
        name: section.name,
        type: section.type
      });

      const newSection = await Section.create({
        name: section.name,
        duration: section.duration,
        type: section.type,
        correctMarks: section.correctMarks || 1,
        instructions: section.instructions,
        testId: test.testId,
      }, { transaction });

      console.log(`Created section with ID: ${newSection.id}`);

      if (section.type === "MCQ") {
        try {
          file = req.files?.find(f => 
            f.originalname.replace(/\.[^/.]+$/, "").toLowerCase() === 
            section.name.toLowerCase()
          ) || req.files?.[index];

          if (!file) {
            console.warn(`No file found for section: ${section.name}`);
            continue;
          }

          console.log(`Processing file: ${file.originalname}`, {
            path: file.path,
            size: file.size
          });

          const questions = parseExcel(file.path); // Now using the correct import
          console.log(`Parsed ${questions.length} questions from file`);

          if (questions.length === 0) {
            console.warn("File content sample:", 
              fs.readFileSync(file.path, 'utf8').substring(0, 200));
            throw new Error("No valid questions found in Excel file");
          }

          const mcqRecords = questions.map(q => ({
            sectionId: newSection.id,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            correctOptionLetter: q.correctOptionLetter,
            marks: q.marks || 1
          }));

          await MCQ.bulkCreate(mcqRecords, { transaction });
          console.log(`Successfully created ${mcqRecords.length} MCQs`);

        } catch (err) {
          console.error(`Error processing MCQ section ${section.name}:`, err);
        } finally {
          try {
            if (file?.path) fs.unlinkSync(file.path);
          } catch (cleanupErr) {
            console.error("File cleanup error:", cleanupErr);
          }
        }
      }
    }

    await transaction.commit();
    console.log("\nTest creation completed successfully");

    return res.status(201).json({ 
      success: true,
      message: "Test created successfully", 
      testId,
      sections: sections.length
    });

  } catch (err) {
    await transaction.rollback();
    console.error("\nTest creation failed:", err);

    return res.status(500).json({ 
      success: false,
      error: "Failed to create test",
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack 
      })
    });
  }
};