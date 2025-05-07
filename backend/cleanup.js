const fs = require('fs');
const path = require('path');

const cleanUp = (filepath) => {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    
    // For C++ also clean up the compiled binary
    if (filepath.endsWith('.cpp')) {
      const outputPath = path.join(__dirname, 'outputs');
      const jobId = path.basename(filepath).split('.')[0];
      const outFile = path.join(outputPath, `${jobId}.out`);
      
      if (fs.existsSync(outFile)) {
        fs.unlinkSync(outFile);
      }
    }
  } catch (err) {
    console.error('Cleanup error:', err);
  }
};

module.exports = { cleanUp };