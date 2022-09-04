const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('order_detail', {
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
        }
    });
}; 