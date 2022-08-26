const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    'product',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      longDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      shortDescription: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      }, 
      stock: {
        type: DataTypes.INTEGER,
      },
      price: {
        type: DataTypes.DOUBLE,
      }
    },
  );
};