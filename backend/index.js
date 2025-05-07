const express = require("express");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executeJava } = require("./executeJava");
const { executePython } = require("./executePython");
const { cleanUp } = require("./cleanup");
const app = express();

console.log("Starting server...");

try {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get("/", (req, res) => {
    console.log("Received GET request to /");
    return res.json({ hello: "world" });
  });

  app.post("/run", async (req, res) => {
    console.log("Received POST request to /run", req.body);
    const { language = "cpp", code, input } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Empty code has been submitted",
      });
    }

    let filepath;
    try {
      filepath = await generateFile(language, code);
      let output;
      if (language === "cpp") {
        output = await executeCpp(filepath, input);
      } else if (language === "python") {
        output = await executePython(filepath, input);
      } else if (language === "java") {
        output = await executeJava(filepath, input);
      } else {
        return res.status(400).json({ success: false, error: "Invalid Language" });
      }
      return res.json({ filepath, output });
    } catch (err) {
      console.error("Error during execution:", err);
      return res.status(500).json({
        success: false,
        error: err.error || "Execution failed",
        stderr: err.stderr || "",
      });
    } finally {
      if (filepath) {
        console.log("Cleaning up:", filepath);
        await cleanUp(filepath);
      }
    }
  });

  app.listen(5000, () => {
    console.log("Listening on port 5000");
  });
} catch (err) {
  console.error("Server startup failed:", err);
}