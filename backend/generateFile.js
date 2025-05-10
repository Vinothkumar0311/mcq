const fs = require("fs").promises;
const path = require("path");
const { v4: uuid } = require("uuid");

const generateFile = async (language, code) => {
  let extension;
  if (language === "cpp") {
    extension = ".cpp";
  } else if (language === "python") {
    extension = ".py";
  } else if (language === "java") {
    extension = ".java";
  } else if (language === "javascript") {
    extension = ".js";
  } else {
    throw new Error("Unsupported language");
  }

  const jobId = uuid();
  const filename = `${jobId}${extension}`;
  const codeDir = path.join(__dirname, "codes");
  const filepath = path.join(codeDir, filename);

  try {
    // Create codes directory if it doesn't exist
    await fs.mkdir(codeDir, { recursive: true });
    console.log("Created or verified codes directory:", codeDir);
    await fs.writeFile(filepath, code);
    console.log("Wrote file:", filepath);
    return filepath;
  } catch (err) {
    console.error("Error in generateFile:", {
      message: err.message,
      stack: err.stack,
    });
    throw err;
  }
};

module.exports = { generateFile };