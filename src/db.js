const { Sequelize } = require('sequelize');
const Chat = require("./models/Chat")

const sequelize = new Sequelize("postgres://angel:JUnior11@localhost/chat", {
    logging: false,
    native: false,
});

Chat(sequelize)


module.exports = {
    ...sequelize.models,
    conn: sequelize,
}