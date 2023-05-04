'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participation extends Model {
    static associate(models) {
      Participation.belongsTo(models.Customer,{foreignKey : "customerID"})
      Participation.belongsTo(models.Promotion,{foreignKey : "promotionID"})
    }
  }
  Participation.init({
    
  }, {
    sequelize,
    modelName: 'Participation',
  });
  return Participation;
};