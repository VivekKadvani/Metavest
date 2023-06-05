'use strict';
const {
  Model
} = require('sequelize');
const whitelist = require('./whitelist');
module.exports = (sequelize, DataTypes) => {
  class vesting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      vesting.belongsTo(models.whitelist, { foreignKey: "tokenId", through: "vestingbelongstowhitelists" })
    }
  }
  vesting.init({
    vestingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    beneficiary: {
      allowNull: false,
      type: DataTypes.STRING
    },
    locked: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    starttime: {
      allowNull: false,
      type: DataTypes.DATE
    },
    cliff: {
      allowNull: false,
      type: DataTypes.DATE
    },
    slicePeriod: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    endTime: {
      allowNull: false,
      type: DataTypes.DATE
    },
    networkId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    tokenId: {
      allowNull: false,
      type: DataTypes.STRING,
      references: {
        model: 'whitelists',
        key: "whitelistId",
        onDelete: "CASCADE",
      }
    },
    amount: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    recieveOnInterval: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    claimed: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'vesting',
  });
  return vesting;
};