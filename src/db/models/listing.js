'use strict';
module.exports = (sequelize, DataTypes) => {
  const Listing = sequelize.define('Listing', {
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    size: DataTypes.STRING,
    color: DataTypes.STRING,
    description: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {});
  Listing.associate = function(models) {
    // associations can be defined here
  };
  return Listing;
};