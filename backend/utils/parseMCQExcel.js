// // const xlsx = require("xlsx");

// // const parseMCQExcel = (filePath) => {
// //   try {
// //     const workbook = xlsx.readFile(filePath);
// //     const sheet = workbook.Sheets[workbook.SheetNames[0]];
// //     const data = xlsx.utils.sheet_to_json(sheet);

// //     return data.map(row => ({
// //       questionText: row["Question"] || row["question"],
// //       optionA: row["OptionA"] || row["A"],
// //       optionB: row["OptionB"] || row["B"],
// //       optionC: row["OptionC"] || row["C"],
// //       optionD: row["OptionD"] || row["D"],
// //       correctOption: row["CorrectAnswer"] || row["Answer"],
// //       marks: row["Marks"] || row["marks"] || 1
// //     }));
// //   } catch (err) {
// //     console.error("Failed to parse Excel:", err.message);
// //     return [];
// //   }
// // };

// // module.exports = parseMCQExcel;

// const xlsx = require("xlsx");

// const parseMCQExcel = (filePath) => {
//   try {
//     const workbook = xlsx.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = xlsx.utils.sheet_to_json(sheet);

//     return data.map(row => ({
//       questionText: row["Question"],
//       optionA: row["OptionA"],
//       optionB: row["OptionB"],
//       optionC: row["OptionC"],
//       optionD: row["OptionD"],
//       correctOption: row["CorrectAnswer"],
//       marks: row["Marks"] || 1
//     }));
//   } catch (err) {
//     console.error("Failed to parse Excel:", err.message);
//     return [];
//   }
// };

// module.exports = parseMCQExcel;

const xlsx = require("xlsx");

const parseMCQExcel = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    return data.map(row => {
      // Debugging: log the row to see actual structure
      console.log("Processing row:", row);
      
      return {
        questionText: row["Question"],
        optionA: row["OptionA"],
        optionB: row["OptionB"],
        optionC: row["OptionC"],
        optionD: row["OptionD"],
        correctOption: row["CorrectAnswer"],
        marks: parseInt(row["Marks"]) || 1 // Ensure marks is a number
      };
    });
  } catch (err) {
    console.error("Failed to parse Excel:", err);
    throw err; // Re-throw to handle in calling function
  }
};

module.exports = parseMCQExcel;