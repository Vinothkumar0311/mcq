const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (language, code) => {
  const jobId = uuid();
  let extension = "";
  if (language === "cpp") {
    extension = ".cpp";
  } else if (language === "python") {
    extension = ".py";
  } else if (language === "javascript") {
    extension = ".js";
  } else if (language === "java") {
    extension = ".java";
  }

  const filename = `${jobId}${extension}`;
  const filepath = path.join(dirCodes, filename);

  await fs.promises.writeFile(filepath, code);

  return filepath;
};

module.exports = { generateFile };