const fs = require("fs").promises;
const path = require("path");

const cleanUp = async (filepath) => {
  try {
    const extension = path.extname(filepath);
    const jobId = path.basename(filepath, extension);
    const outputPath = path.join(__dirname, "outputs");

    await fs.unlink(filepath);

    if (extension === ".cpp") {
      const outPath = path.join(outputPath, `${jobId}.out`);
      await fs.unlink(outPath).catch(() => {});
    } else if (extension === ".java") {
      const classPath = path.join(path.dirname(filepath), `${jobId}.class`);
      await fs.unlink(classPath).catch(() => {});
    }
  } catch (err) {
    console.error(`Cleanup failed for ${filepath}:`, err);
  }
};

module.exports = { cleanUp };