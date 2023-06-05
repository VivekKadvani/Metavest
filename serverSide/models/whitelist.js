'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class whitelist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      whitelist.hasMany(models.vesting, { foreignKey: "tokenId" })
    }
  }
  whitelist.init({
    whitelistId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tokenAddress: {
      allowNull: false,
      type: DataTypes.STRING
    },
    tokenName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    tokenSymbol: {
      allowNull: false,
      type: DataTypes.STRING
    },
    networkId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    decimals: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'whitelist',
  });
  return whitelist;
};