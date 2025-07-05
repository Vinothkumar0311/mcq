// const { exec } = require("child_process");
// const path = require("path");

// const executePython = (filepath, input) => {
//   const normalizedPath = path.normalize(filepath);
//   return new Promise((resolve, reject) => {
//     const process = exec(
//       `python "${normalizedPath}"`,
//       { timeout: 5000 },
//       (error, stdout, stderr) => {
//         if (error) {
//           return reject({ error: error.message, stderr });
//         }
//         if (stderr) {
//           return reject({ error: "Execution failed", stderr });
//         }
//         resolve(stdout);
//       }
//     );

//     if (input) {
//       process.stdin.write(input);
//       process.stdin.end();
//     }
//   });
// };

// module.exports = { executePython };

const { exec } = require("child_process");
const path = require("path");

const executePython = (filepath, input) => {
  const normalizedPath = path.normalize(filepath);
  return new Promise((resolve, reject) => {
    const process = exec(
      `python3 "${normalizedPath}"`,
      { timeout: 5000 },
      (error, stdout, stderr) => {
        if (error) {
          return reject({ error: error.message, stderr });
        }
        if (stderr) {
          return reject({ error: "Execution failed", stderr });
        }
        resolve(stdout);
      }
    );

    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }
  });
};

module.exports = { executePython };
