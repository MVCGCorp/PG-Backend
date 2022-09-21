const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    'category',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }
    },
  );
};
