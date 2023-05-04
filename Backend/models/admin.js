'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {}
  }
  Admin.init({
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    isDeleted : DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};