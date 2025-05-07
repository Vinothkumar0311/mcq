const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, input) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);
  const normalizedFilepath = path.normalize(filepath);
  const normalizedOutPath = path.normalize(outPath);

  return new Promise((resolve, reject) => {
    const process = exec(
      `g++ "${normalizedFilepath}" -o "${normalizedOutPath}" && "${normalizedOutPath}"`,
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

module.exports = { executeCpp };