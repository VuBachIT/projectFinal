'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.Reward,{foreignKey : 'customerID'})
      Customer.hasMany(models.Participation,{foreignKey : 'customerID'})
    }
  }
  Customer.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING(500),
    phoneNumber: DataTypes.STRING,
    name: DataTypes.STRING,
    lang : DataTypes.FLOAT,
    long : DataTypes.FLOAT,
    isDeleted : DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};