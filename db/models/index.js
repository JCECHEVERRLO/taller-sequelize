
const { DeporteModel, deporteSchema } = require('./deporte.model');

function setUpModels (sequelize){
    DeporteModel.init(deporteSchema, DeporteModel.config(sequelize));

}

module.exports = setUpModels;