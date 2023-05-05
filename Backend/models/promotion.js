'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    static associate(models) {
      Promotion.hasMany(models.Participation,{foreignKey : 'promotionID'})
      Promotion.hasMany(models.Voucher,{foreignKey : 'promotionID'})
      Promotion.belongsTo(models.Partner,{foreignKey : 'partnerID'})
      Promotion.belongsTo(models.Status,{foreignKey : 'statusID'})
    }
  }
  Promotion.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    start: DataTypes.DATEONLY,
    end: DataTypes.DATEONLY,
    isDeleted : DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Promotion',
  });
  return Promotion;
};