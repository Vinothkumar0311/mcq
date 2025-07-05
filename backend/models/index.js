// const sequelize = require("../config/db");

// const Test = require("./test.model");
// const Section = require("./section.model");
// const MCQ = require("./mcq");

// // Define relationships
// Test.hasMany(Section, { foreignKey: "testId" });
// Section.belongsTo(Test, { foreignKey: "testId" });

// Section.hasMany(MCQ, { foreignKey: "sectionId" });
// MCQ.belongsTo(Section, { foreignKey: "sectionId" });

// module.exports = {
//   sequelize,
//   Test,
//   Section,
//   MCQ,
// };

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Test = require("./test.model")(sequelize, DataTypes);
const Section = require("./section.model")(sequelize, DataTypes);
const MCQ = require("./mcq")(sequelize, DataTypes);

// Define associations
Test.hasMany(Section, { foreignKey: "testId" });
Section.belongsTo(Test, { foreignKey: "testId" });

Section.hasMany(MCQ, { foreignKey: "sectionId" });
MCQ.belongsTo(Section, { foreignKey: "sectionId" });

module.exports = {
  sequelize,
  Sequelize,
  Test,
  Section,
  MCQ,
};
