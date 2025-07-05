// // // const { Test, Section, MCQ } = require("../models");
// // // const generateTestId = require("../utils/generateTestId");
// // // const parseMCQExcel = require("../utils/parseMCQExcel");
// // // const fs = require("fs");

// // // exports.createTest = async (req, res) => {
// // //   try {
// // //     const { name, description, instructions } = req.body;
// // //     let sections = req.body.sections;

// // //     if (typeof sections === "string") {
// // //       sections = JSON.parse(sections);
// // //     }

// // //     const testId = await generateTestId();
// // //     const test = await Test.create({ testId, name, description, instructions });

// // //     for (const section of sections) {
// // //       const newSection = await Section.create({
// // //         name: section.name,
// // //         duration: section.duration,
// // //         type: section.type,
// // //         correctMarks: section.correctMarks,
// // //         instructions: section.instructions,
// // //         testId: test.testId,
// // //       });

// // //       // === Match section name with file key ===
// // //       const matchedFileKey = Object.keys(req.files || {}).find(
// // //         key => key.toLowerCase().trim() === section.name.toLowerCase().trim()
// // //       );

// // //       if (section.type === "MCQ" && matchedFileKey) {
// // //         const filePath = req.files[matchedFileKey][0].path;

// // //         const questions = parseMCQExcel(filePath); // Utility function to parse Excel

// // //         for (const q of questions) {
// // //           try {
// // //             await MCQ.create({
// // //               sectionId: newSection.id,
// // //               questionText: q.questionText,
// // //               optionA: q.optionA,
// // //               optionB: q.optionB,
// // //               optionC: q.optionC,
// // //               optionD: q.optionD,
// // //               correctOption: q.correctOption,
// // //               marks: q.marks || 1, // default marks
// // //             });
// // //           } catch (err) {
// // //             console.error("Failed to insert question:", q, err.message);
// // //           }
// // //         }

// // //         fs.unlinkSync(filePath); // cleanup
// // //       } else {
// // //         console.warn(`No MCQ file found for section: ${section.name}`);
// // //       }
// // //     }

// // //     res.status(201).json({ message: "Test created successfully", testId });
// // //   } catch (err) {
// // //     console.error("Error in createTest:", err);
// // //     res.status(500).json({ error: "Failed to create test" });
// // //   }
// // // };

// // const { Test, Section, MCQ } = require("../models");
// // const generateTestId = require("../utils/generateTestId");
// // const parseMCQExcel = require("../utils/parseMCQExcel");
// // const fs = require("fs");

// // const normalize = (str) =>
// //   str
// //     .toLowerCase()
// //     .replace(/\s+/g, "")
// //     .replace(/[^a-z0-9]/g, "");

// // exports.createTest = async (req, res) => {
// //   try {
// //     const { name, description, instructions } = req.body;
// //     let sections = req.body.sections;

// //     if (typeof sections === "string") {
// //       sections = JSON.parse(sections);
// //     }

// //     const testId = await generateTestId();
// //     const test = await Test.create({ testId, name, description, instructions });

// //     const fileKeys = Object.keys(req.files || {});
// //     console.log("📁 Uploaded file keys:", fileKeys);

// //     for (let i = 0; i < sections.length; i++) {
// //       const section = sections[i];
// //       const newSection = await Section.create({
// //         name: section.name,
// //         duration: section.duration,
// //         type: section.type,
// //         correctMarks: section.correctMarks,
// //         instructions: section.instructions,
// //         testId: test.testId,
// //       });

// //       let matchedFileKey = fileKeys.find(
// //         (key) => normalize(key) === normalize(section.name)
// //       );

// //       // Fallback to index match if name match fails
// //       if (!matchedFileKey && fileKeys[i]) {
// //         matchedFileKey = fileKeys[i];
// //       }

// //       console.log(`🔍 Matching file for section: ${section.name}`);
// //       console.log(`✅ Matched file key: ${matchedFileKey}`);

// //       if (section.type === "MCQ" && matchedFileKey) {
// //         const fileArray = req.files[matchedFileKey];
// //         if (!fileArray || !fileArray[0] || !fileArray[0].path) {
// //           console.warn(`⚠️ No valid file found for section: ${section.name}`);
// //           continue;
// //         }

// //         const filePath = fileArray[0].path;
// //         const questions = parseMCQExcel(filePath);
// //         console.log("🧪 Questions parsed:", questions.length);

// //         for (const q of questions) {
// //           await MCQ.create({
// //             sectionId: newSection.id,
// //             questionText: q.questionText,
// //             optionA: q.optionA,
// //             optionB: q.optionB,
// //             optionC: q.optionC,
// //             optionD: q.optionD,
// //             correctOption: q.correctOption,
// //             marks: q.marks || 1,
// //           });
// //         }

// //         fs.unlinkSync(filePath);
// //       } else {
// //         console.warn(`⚠️ No MCQ file matched for section: ${section.name}`);
// //       }
// //     }

// //     res.status(201).json({ message: "Test created successfully", testId });
// //   } catch (err) {
// //     console.error("❌ Error in createTest:", err);
// //     res.status(500).json({ error: "Failed to create test" });
// //   }
// // };


// const { Test, Section, MCQ, sequelize } = require("../models");
// const generateTestId = require("../utils/generateTestId");
// const parseMCQExcel = require("../utils/parseMCQExcel");
// const fs = require("fs");

// const normalize = (str) =>
//   str
//     .toLowerCase()
//     .replace(/\s+/g, "")
//     .replace(/[^a-z0-9]/g, "");

// exports.createTest = async (req, res) => {
//   const transaction = await sequelize.transaction();
  
//   try {
//     const { name, description, instructions } = req.body;
//     let sections = req.body.sections;

//     if (typeof sections === "string") {
//       try {
//         sections = JSON.parse(sections);
//       } catch (err) {
//         await transaction.rollback();
//         return res.status(400).json({ error: "Invalid sections format" });
//       }
//     }

//     // Generate test ID and create test record
//     const testId = await generateTestId();
//     const test = await Test.create({ 
//       testId, 
//       name, 
//       description, 
//       instructions 
//     }, { transaction });

//     const fileKeys = Object.keys(req.files || {});
//     console.log("📁 Uploaded files:", fileKeys);

//     // Process each section
//     for (let i = 0; i < sections.length; i++) {
//       const section = sections[i];
//       console.log(`🔄 Processing section: ${section.name}`);

//       const newSection = await Section.create({
//         name: section.name,
//         duration: section.duration,
//         type: section.type,
//         correctMarks: section.correctMarks,
//         instructions: section.instructions,
//         testId: test.testId,
//       }, { transaction });

//       // Find matching file for section
//       let matchedFileKey = fileKeys.find(
//         (key) => normalize(key) === normalize(section.name)
//       );

//       // Fallback to index match if name match fails
//       if (!matchedFileKey && fileKeys[i]) {
//         matchedFileKey = fileKeys[i];
//         console.log(`🔍 Using fallback file match by index for ${section.name}`);
//       }

//       if (section.type === "MCQ" && matchedFileKey) {
//         console.log(`📝 Processing MCQ file for section: ${section.name}`);
        
//         const fileArray = req.files[matchedFileKey];
//         if (!fileArray || !fileArray[0] || !fileArray[0].path) {
//           console.warn(`⚠️ No valid file found for section: ${section.name}`);
//           continue;
//         }

//         const filePath = fileArray[0].path;
//         console.log(`📄 Processing file at path: ${filePath}`);

//         try {
//           // Read and parse the Excel file
//           const questions = parseMCQExcel(filePath);
//           console.log(`✅ Parsed ${questions.length} questions from file`);

//           if (questions.length === 0) {
//             console.warn("⚠️ No questions found in the Excel file");
//           }

//           // Create all MCQs in bulk for better performance
//           const mcqRecords = questions.map(q => ({
//             sectionId: newSection.id,
//             questionText: q.questionText,
//             optionA: q.optionA,
//             optionB: q.optionB,
//             optionC: q.optionC,
//             optionD: q.optionD,
//             correctOption: q.correctOption,
//             marks: q.marks || 1,
//           }));

//           await MCQ.bulkCreate(mcqRecords, { transaction });
//           console.log(`✔️ Created ${mcqRecords.length} MCQs for section ${section.name}`);

//         } catch (parseError) {
//           console.error(`❌ Failed to process MCQ file: ${parseError.message}`);
//           console.error(parseError.stack);
//           await transaction.rollback();
//           return res.status(400).json({ 
//             error: `Invalid MCQ file format for section ${section.name}` 
//           });
//         } finally {
//           // Clean up the uploaded file
//           try {
//             fs.unlinkSync(filePath);
//           } catch (unlinkError) {
//             console.error(`⚠️ Failed to delete temp file: ${unlinkError.message}`);
//           }
//         }
//       } else {
//         console.log(`ℹ️ No MCQ file processing needed for section: ${section.name}`);
//       }
//     }

//     // Commit the transaction if everything succeeded
//     await transaction.commit();
//     console.log(`🎉 Test created successfully with ID: ${testId}`);
//     return res.status(201).json({ 
//       message: "Test created successfully", 
//       testId 
//     });

//   } catch (err) {
//     // Rollback transaction on error
//     await transaction.rollback();
//     console.error("❌ Error in createTest:", err.message);
//     console.error(err.stack);
//     return res.status(500).json({ 
//       error: "Failed to create test",
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };


const { Test, Section, MCQ, sequelize } = require("../models");
const generateTestId = require("../utils/generateTestId");
const { parseExcel } = require("../utils/fileUpload");

const normalize = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

exports.createTest = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Validate request
    if (!req.body.sections) {
      await transaction.rollback();
      return res.status(400).json({ error: "Sections data is required" });
    }

    // Parse sections
    let sections;
    try {
      sections = typeof req.body.sections === 'string' 
        ? JSON.parse(req.body.sections) 
        : req.body.sections;
    } catch (err) {
      await transaction.rollback();
      return res.status(400).json({ error: "Invalid sections format" });
    }

    // Create test
    const testId = await generateTestId();
    const test = await Test.create({ 
      testId, 
      name: req.body.name,
      description: req.body.description,
      instructions: req.body.instructions
    }, { transaction });

    // Process sections
    for (const [index, section] of sections.entries()) {
      console.log(`Processing section ${index + 1}/${sections.length}: ${section.name}`);

      const newSection = await Section.create({
        name: section.name,
        duration: section.duration,
        type: section.type,
        correctMarks: section.correctMarks,
        instructions: section.instructions,
        testId: test.testId,
      }, { transaction });

      // Handle MCQ sections
      if (section.type === "MCQ") {
        try {
          // Get file by index or name
          const file = req.files && (
            req.files[index] || 
            Object.values(req.files).find(f => 
              normalize(f.originalname) === normalize(`${section.name}.xlsx`)
            )
          );

          if (!file) {
            console.warn(`No file found for section: ${section.name}`);
            continue;
          }

          // Parse and validate questions
          const questions = parseExcel(file.buffer);
          if (!questions || questions.length === 0) {
            console.warn(`No valid questions found in file for section: ${section.name}`);
            continue;
          }

          // Create MCQs
          await MCQ.bulkCreate(
            questions.map(q => ({
              sectionId: newSection.id,
              questionText: q.questionText,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              correctOption: q.correctOption,
              marks: q.marks
            })),
            { transaction }
          );

          console.log(`Created ${questions.length} MCQs for section ${section.name}`);
        } catch (err) {
          console.error(`Error processing MCQ section ${section.name}:`, err.message);
          // Continue with next section even if this one fails
        }
      }
    }

    await transaction.commit();
    return res.status(201).json({ 
      message: "Test created successfully", 
      testId,
      sections: sections.length
    });

  } catch (err) {
    await transaction.rollback();
    console.error("Error in createTest:", err);
    return res.status(500).json({ 
      error: "Failed to create test",
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};