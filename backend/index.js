const express = require("express");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ helo: "world" });
});

// app.post("/run", async (req, res) => {
//   const { language = "cpp", code } = req.body;

//   if (code == undefined) {
//     return res
//       .status(400)
//       .json({ sucess: false, erro: "Empty code has been Submitted" });
//   }

//   const filepath = await generateFile(language, code);

//   const output = await executeCpp(filepath);

//   return res.json({ filepath, output });
// });


app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Empty code has been submitted",
    });
  }

  try {
    const filepath = await generateFile(language, code);
    const output = await executeCpp(filepath);
    return res.json({ filepath, output });
  } catch (err) {
    // Send a JSON response with readable error message
    return res.status(500).json({
      success: false,
      error: err.error || "Execution failed",
      stderr: err.stderr || "",
    });
  }
});


app.listen(5000, () => {
  console.log("Listening on port 5000");
});
