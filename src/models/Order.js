const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("order", {
    status: {
      type: DataTypes.ENUM,
      values: [
        "carrito",
        "created",
        "processing",
        "comfirmed",
        "send",
        "canceled",
        "completed",
      ],
      defaultValue: "carrito",
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        isFloat: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
  });
};
