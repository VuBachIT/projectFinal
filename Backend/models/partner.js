'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Partner extends Model {
    static associate(models) {
      Partner.hasMany(models.Promotion, { foreignKey: 'partnerID' })
      Partner.hasMany(models.Store, { foreignKey: 'partnerID' })
      Partner.hasMany(models.Reward, { foreignKey: 'partnerID' })
      Partner.belongsTo(models.Category, { foreignKey: 'categoryID' })
    }
  }
  Partner.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING(500),
    name: DataTypes.STRING,
    address: DataTypes.STRING(500),
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Partner',
  });
  return Partner;
};