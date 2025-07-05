// const express = require("express");
// const { generateFile } = require("./generateFile");
// const { executeCpp } = require("./executeCpp");
// const { executeJava } = require("./executeJava");
// const { executePython } = require("./executePython");
// const { executeJavaScript } = require("./executeJavaScript");
// const { cleanUp } = require("./cleanup");
// const app = express();

// // Handle unhandled Promise rejections
// process.on("unhandledRejection", (reason, promise) => {
//   console.error("Unhandled Rejection:", { reason, promise });
// });

// // Handle uncaught exceptions
// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", {
//     message: err.message || "No message",
//     stack: err.stack || "No stack",
//   });
// });

// // Set request timeout (10 seconds)
// app.use((req, res, next) => {
//   res.setTimeout(10000, () => {
//     console.error("Request timed out:", req.body);
//     res.status(504).json({
//       success: false,
//       error: "Request timed out",
//     });
//   });
//   next();
// });

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.get("/", (req, res) => {
//   console.log("Received GET request to /");
//   return res.json({ hello: "world" });
// });

// app.post("/run", async (req, res) => {
//   console.log("Received POST request to /run", req.body);
//   const startTime = Date.now();
//   const { language = "cpp", code, input } = req.body;

//   if (!code) {
//     return res.status(400).json({
//       success: false,
//       error: "Empty code has been submitted",
//     });
//   }

//   let filepath;
//   try {
//     filepath = await generateFile(language, code);
//     console.log("Generated file:", filepath, `Time: ${Date.now() - startTime}ms`);
//     let output;
//     if (language === "cpp") {
//       output = await executeCpp(filepath, input);
//     } else if (language === "python") {
//       output = await executePython(filepath, input);
//     } else if (language === "java") {
//       output = await executeJava(filepath, input);
//     } else if (language === "javascript") {
//       output = await executeJavaScript(filepath, input);
//     } else {
//       return res.status(400).json({ success: false, error: "Invalid Language" });
//     }
//     const response = { filepath, output };
//     console.log("Sending response:", response, `Time: ${Date.now() - startTime}ms`);
//     res.json(response);
//     console.log("Response sent for:", req.body, `Total time: ${Date.now() - startTime}ms`);
//   } catch (err) {
//     const errorResponse = {
//       success: false,
//       error: err.error || err.message || "Execution failed",
//       stderr: err.stderr || "",
//       fullError: err.fullError || { message: err.message || "No message", stack: err.stack || "No stack" },
//     };
//     console.error("Error during execution:", errorResponse, `Time: ${Date.now() - startTime}ms`);
//     res.status(500).json(errorResponse);
//     console.log("Error response sent for:", req.body, `Total time: ${Date.now() - startTime}ms`);
//   } finally {
//     if (filepath) {
//       setTimeout(async () => {
//         try {
//           console.log("Cleaning up:", filepath, `Time: ${Date.now() - startTime}ms`);
//           await cleanUp(filepath);
//         } catch (cleanupErr) {
//           console.error("Cleanup failed:", cleanupErr);
//         }
//       }, 100); // Defer cleanup to avoid blocking
//     }
//   }
// });

// app.listen(5000, (err) => {
//   if (err) {
//     console.error("Failed to start server:", err);
//     return;
//   }
//   console.log("Listening on port 5000");
// });


const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { sequelize } = require("./models"); // Sequelize models

// Custom code execution modules
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executeJava } = require("./executeJava");
const { executePython } = require("./executePython");
const { executeJavaScript } = require("./executeJavaScript");
const { cleanUp } = require("./cleanup");

// Express app setup
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded Excel files if needed

// Timeout middleware
app.use((req, res, next) => {
  res.setTimeout(10000, () => {
    console.error("Request timed out:", req.body);
    res.status(504).json({ success: false, error: "Request timed out" });
  });
  next();
});

// Error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", { reason, promise });
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", {
    message: err.message || "No message",
    stack: err.stack || "No stack",
  });
});

// Base Route
app.get("/", (req, res) => {
  console.log("Received GET request to /");
  return res.json({ hello: "world" });
});

// Code execution route
app.post("/run", async (req, res) => {
  console.log("Received POST request to /run", req.body);
  const startTime = Date.now();
  const { language = "cpp", code, input } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code has been submitted" });
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
    } else if (language === "javascript") {
      output = await executeJavaScript(filepath, input);
    } else {
      return res.status(400).json({ success: false, error: "Invalid Language" });
    }

    res.json({ filepath, output });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.error || err.message || "Execution failed",
      stderr: err.stderr || "",
      fullError: err.fullError || { message: err.message, stack: err.stack },
    });
  } finally {
    if (filepath) {
      setTimeout(async () => {
        try {
          await cleanUp(filepath);
        } catch (cleanupErr) {
          console.error("Cleanup failed:", cleanupErr);
        }
      }, 100);
    }
  }
});

// Test creation route
const testRoutes = require("./routes/testRoutes");
app.use("/api/test", testRoutes);

// Start server after DB sync
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.listen(5000, () => console.log("Server running on port 5000"));
});
