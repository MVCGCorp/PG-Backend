const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("order", {
    status: {
    type: DataTypes.ENUM ("carrito", "created","processing","comfirmed","canceled","completed"),
     defaultValue: "carrito",
     allowNull: false,
    },
 
  });
};
