const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("user", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-z]+$/i,
        isAlpha: true,
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[0-9a-f]{64}$/i,
      },
    },
    rol: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["user", "admin"],
      defaultValue: "user",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: true,
      },
    },
  });
};
