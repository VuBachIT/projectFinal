'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
        Activity.belongsTo(models.Customer,{foreignKey : 'customerID'})
        Activity.belongsTo(models.Voucher,{foreignKey : 'voucherID'})
    }
  }
  Activity.init({
    expDate: DataTypes.DATEONLY,
    isUsed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Activity',
  });
  return Activity;
};