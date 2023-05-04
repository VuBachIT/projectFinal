'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reward extends Model {
    static associate(models) {
      Reward.belongsTo(models.Voucher,{foreignKey : "voucherID"})
      Reward.belongsTo(models.Customer,{foreignKey : "customerID"})
    }
  }
  Reward.init({
    
  }, {
    sequelize,
    modelName: 'Reward',
  });
  return Reward;
};