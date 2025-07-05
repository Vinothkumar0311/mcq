module.exports = (sequelize, DataTypes) => {
  const MCQ = sequelize.define("MCQ", {
    questionText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    optionA: DataTypes.STRING,
    optionB: DataTypes.STRING,
    optionC: DataTypes.STRING,
    optionD: DataTypes.STRING,
    correctOption: DataTypes.STRING,
    marks: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return MCQ;
};
