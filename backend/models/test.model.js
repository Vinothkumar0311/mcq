module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define("Test", {
    testId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true, // 👈 Make testId the primary key
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    instructions: DataTypes.TEXT,
  });

  return Test;
};
