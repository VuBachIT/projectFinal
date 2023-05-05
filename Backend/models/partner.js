'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Partner extends Model {
    static associate(models) {
      Partner.hasMany(models.Promotion,{foreignKey : 'partnerID'})
      Partner.belongsTo(models.Category,{foreignKey : 'categoryID'})
    }
  }
  Partner.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    name: DataTypes.STRING,
    isDeleted : DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Partner',
  });
  return Partner;
};