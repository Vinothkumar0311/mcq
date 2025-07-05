module.exports = (sequelize, DataTypes) => {
  const MCQ = sequelize.define("MCQ", {
    questionText: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    optionA: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    optionB: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    optionC: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    optionD: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    correctOption: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    correctOptionLetter: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['A', 'B', 'C', 'D']]
      }
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return MCQ;
};