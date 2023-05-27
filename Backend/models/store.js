'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
      Store.belongsTo(models.Partner, { foreignKey: 'partnerID' })
    }
  }
  Store.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING(500),
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};