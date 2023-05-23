'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    static associate(models) {
      Voucher.hasMany(models.Activity,{foreignKey : 'voucherID'})
      Voucher.hasMany(models.Detail,{foreignKey : 'voucherID'})
    }
  }
  Voucher.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    value: DataTypes.FLOAT,
    isDeleted : DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Voucher',
  });
  return Voucher;
};