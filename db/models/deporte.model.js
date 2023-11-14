    const {Model, DataTypes} = require('sequelize');
  
    const DEPORTE_TABLE = 'deportes';

    const deporteSchema = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        jugadores:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
    
    };

    class DeporteModel extends Model{
        static associate(models){
            // this.belongsTo(models.UserModel, {foreignKey: 'user:id', as: 'User'});
        }

        static config(sequelize){ //envia la conexion a la base de datos
            return {
                sequelize,
                tableName: DEPORTE_TABLE,
                modelName: 'deporte',
                timestamps: false
            }
        }
    }

    module.exports = {DEPORTE_TABLE, deporteSchema, DeporteModel};