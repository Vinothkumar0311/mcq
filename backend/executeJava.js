const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeJava = async (filepath, input) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outDir = path.dirname(filepath);

  const code = await fs.promises.readFile(filepath, "utf-8");
  const classNameMatch = code.match(/public\s+class\s+(\w+)/);
  const className = classNameMatch ? classNameMatch[1] : jobId;

  return new Promise((resolve, reject) => {
    exec(`javac "${filepath}" -d "${outDir}"`, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        return reject({ error: compileError.message, stderr: compileStderr });
      }
      if (compileStderr) {
        return reject({ error: "Compilation failed", stderr: compileStderr });
      }

      const runProcess = exec(
        `cd "${outDir}" && java ${className}`,
        { timeout: 5000 },
        (runError, runStdout, runStderr) => {
          if (runError) {
            return reject({ error: runError.message, stderr: runStderr });
          }
          if (runStderr) {
            return reject({ error: "Execution failed", stderr: runStderr });
          }
          resolve(runStdout);
        }
      );

      if (input) {
        runProcess.stdin.write(input);
        runProcess.stdin.end();
      }
    });
  });
};

module.exports = { executeJava };