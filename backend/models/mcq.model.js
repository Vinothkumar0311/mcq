const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Section = require("./section.model");

const MCQ = sequelize.define("MCQ", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  questionText: DataTypes.STRING,
  optionA: DataTypes.STRING,
  optionB: DataTypes.STRING,
  optionC: DataTypes.STRING,
  optionD: DataTypes.STRING,
  correctOption: DataTypes.STRING,
});

Section.hasMany(MCQ, { foreignKey: "sectionId" });
MCQ.belongsTo(Section, { foreignKey: "sectionId" });

module.exports = MCQ;
