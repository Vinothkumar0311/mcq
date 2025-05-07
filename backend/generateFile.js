const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

// Ensure the directory exists
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format, code) => {
  const jobId = uuid();
  const filename = `${jobId}.${format}`;
  const filepath = path.join(dirCodes, filename);

  await fs.promises.writeFile(filepath, code); // write the code to file

  return filepath;
};

module.exports = { generateFile };
