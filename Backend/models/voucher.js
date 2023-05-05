'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    static associate(models) {
      Voucher.hasMany(models.Reward,{foreignKey : 'voucherID'})
      Voucher.belongsTo(models.Promotion,{foreignKey : 'promotionID'})
      Voucher.belongsTo(models.Game,{foreignKey : 'gameID'})
    }
  }
  Voucher.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    value: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    expDate: DataTypes.DATEONLY,
    isUsed : DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Voucher',
  });
  return Voucher;
};