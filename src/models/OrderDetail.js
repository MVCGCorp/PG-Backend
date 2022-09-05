const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("orderDetail", {
    price: {
      type: DataTypes.DOUBLE,
      validate: {
        isNumeric: true,
      },
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
