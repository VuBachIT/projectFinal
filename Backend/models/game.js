'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      Game.hasMany(models.Voucher,{foreignKey : "gameID"})
    }
  }
  Game.init({
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};