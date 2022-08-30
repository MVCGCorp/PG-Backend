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
      unique: {   //valida que hay un solo usuario con ese Email 
        args: true,
        msg: 'Ya existe un usuario con ese email'
    },
      validate: {
        isEmail: true,
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
        notNull: { 
          args: true, 
          msg: 'password can\'t be empty' 
        },           
        len: { 
          args: [5, 50],
          msg: 'password length must be more than 5 characters' 
          },
    }
    },
  });
};