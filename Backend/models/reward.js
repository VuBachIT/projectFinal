'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reward extends Model {
    static associate(models) {
      Reward.belongsTo(models.Customer, { foreignKey: 'customerID' })
      Reward.belongsTo(models.Voucher, { foreignKey: 'voucherID' })
      Reward.belongsTo(models.Promotion, { foreignKey: 'promotionID' })
      Reward.belongsTo(models.Partner, { foreignKey: 'partnerID' })
    }
  }
  Reward.init({
    expDate: DataTypes.DATEONLY,
    isUsed: DataTypes.BOOLEAN,
    code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reward',
  });
  return Reward;
};