'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    static associate(models) {
      Detail.belongsTo(models.Voucher, { foreignKey: 'voucherID' })
      Detail.belongsTo(models.Promotion, { foreignKey: 'promotionID' })
    }
  }
  Detail.init({
    quantity: DataTypes.INTEGER,
    balanceQty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Detail',
  });
  return Detail;
};