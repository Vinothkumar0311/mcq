const { spawn, exec } = require("child_process");
const path = require("path");
const fs = require("fs").promises;

const executeJavaScript = async (filepath, input) => {
  const normalizedPath = path.normalize(filepath);
  console.log(`Executing JavaScript: node "${normalizedPath}"`);
  try {
    await fs.access(normalizedPath);
    console.log("File exists:", normalizedPath);
  } catch (err) {
    console.error("File access error:", err);
    throw new Error(`File not found or inaccessible: ${normalizedPath}`);
  }

  return new Promise((resolve, reject) => {
    const timeout = 3000; // 3 seconds
    let isTimedOut = false;
    let stdoutData = "";
    let stderrData = "";
    let hasError = false;

    const process = spawn("node", [normalizedPath], {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
      detached: true, // Detach to prevent event loop blocking
    });

    console.log("Spawned process with PID:", process.pid);

    if (input) {
      console.log("Providing input:", input);
      process.stdin.write(input);
      process.stdin.end();
    }

    process.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    process.stderr.on("data", (data) => {
      stderrData += data.toString();
      hasError = true; // Flag error as soon as stderr is received
    });

    process.on("error", (err) => {
      console.error("Process error:", err);
      if (!isTimedOut) {
        reject({
          error: "Process failed",
          stderr: err.message,
          fullError: err,
        });
      }
    });

    process.on("exit", (code, signal) => {
      console.log("Process exited:", { code, signal, hasError });
      clearTimeout(timeoutId);
      clearInterval(errorCheckId);
      if (isTimedOut) {
        return reject({
          error: `Command timed out after ${timeout / 1000} seconds`,
          stderr: stderrData,
          fullError: { message: "Timeout", code: "ETIMEDOUT", signal },
        });
      }
      if (hasError || code !== 0) {
        return reject({
          error: "Execution failed",
          stderr: stderrData,
          fullError: { message: "Non-zero exit or stderr", code, stderr: stderrData },
        });
      }
      resolve(stdoutData);
    });

    // Early exit for errors
    const errorCheckId = setInterval(() => {
      if (hasError && stderrData) {
        clearInterval(errorCheckId);
        clearTimeout(timeoutId);
        if (process.platform === "win32") {
          exec(`taskkill /PID ${process.pid} /F /T`, (err) => {
            if (err) console.error("Taskkill error:", err);
            console.log("Process killed early due to error");
          });
        } else {
          process.kill("SIGTERM");
        }
      }
    }, 100);

    const timeoutId = setTimeout(() => {
      setImmediate(() => {
        isTimedOut = true;
        clearInterval(errorCheckId);
        console.log("Timeout triggered for PID:", process.pid);
        if (process.platform === "win32") {
          exec(`taskkill /PID ${process.pid} /F /T`, (err) => {
            if (err) {
              console.error("Taskkill timeout error:", err);
            } else {
              console.log("Process killed via taskkill for timeout");
            }
          });
        } else {
          process.kill("SIGTERM");
        }
      });
    }, timeout);
  });
};

module.exports = { executeJavaScript };