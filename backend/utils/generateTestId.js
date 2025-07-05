const { Test } = require("../models");

const generateTestId = async () => {
  const lastTest = await Test.findOne({ order: [["createdAt", "DESC"]] });
  let lastId = 0;

  if (lastTest && lastTest.testId) {
    lastId = parseInt(lastTest.testId.replace("Test", ""));
  }

  const newId = lastId + 1;
  return `Test${String(newId).padStart(4, "0")}`;
};

module.exports = generateTestId;
