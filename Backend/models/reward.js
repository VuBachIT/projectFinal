'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reward extends Model {
    static associate(models) {
        Reward.belongsTo(models.Customer,{foreignKey : 'customerID'})
        Reward.belongsTo(models.Voucher,{foreignKey : 'voucherID'})
    }
  }
  Reward.init({
    expDate: DataTypes.DATEONLY,
    isUsed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Reward',
  });
  return Reward;
};