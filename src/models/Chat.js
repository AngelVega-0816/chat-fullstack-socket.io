const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define("chat", {
        nick: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        msg: {
            type: DataTypes.STRING,            
        }
    })
}