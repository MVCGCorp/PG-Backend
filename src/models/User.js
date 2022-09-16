const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("user", {
    given_name: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   is: /^[a-z]+$/i,
      //   isAlpha: true,
      // },
    },
    family_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    picture:{
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: true,
      validate: { 
        isIn:{ args: [['user', 'admin', 'mododios']],
        msg: "Rol can only be either 'user', 'admin' or 'mododios'"
      }
    },
      defaultValue: "user",
    },
   isDisable:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
}

  });
};
