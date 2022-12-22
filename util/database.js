const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('travel-agency', 'root', 'admin', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;