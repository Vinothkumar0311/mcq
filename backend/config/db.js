const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('test_platform', 'root', 'nsg007', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
