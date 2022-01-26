const { DataTypes } = require("sequelize");
const Publication = require("../publications/publication.model");

module.exports = model;

function model(sequelize) {
  const attributes = {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false },
    hash: { type: DataTypes.STRING, allowNull: false },
  };

  const options = {
    defaultScope: {
      // exclude hash by default
      attributes: { exclude: ["hash"] },
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {} },
    },
  };

  var User = sequelize.define("User", attributes, options);
  User.associate = function (models) {
    User.hasMany(models.Publication, {
      as: "publications",
      foreignKey: { name: "userId", type: DataTypes.INTEGER, allowNull: false },
    });
  };

  return User;
}
