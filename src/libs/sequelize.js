const {Sequelize} = require ('sequelize');
    const setUpModels = require('../../db/models');



    const sequelize = new Sequelize('deportes','postgres', 'Manizales',{
    host: 'localhost',
    dialect: 'postgres',
    logging: false
    });

 
    const models = setUpModels(sequelize);
console.log(" ",models);
setUpModels(sequelize);
module.exports = sequelize;