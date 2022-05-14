const express = require('express');
const path = require('path')
const SocketIO = require('socket.io')
const { conn } = require('./db')
const app = express();

//settings
app.set("port", process.env.PORT || 3000);

//static files
app.use(express.static(path.join(__dirname, "public")))

conn.sync({ force: false});
//start the server
let server = app.listen(app.get("port"), () => {
    console.log("listen on port ", app.get("port"))
})



const io = SocketIO(server);
 
//websockets
require('./sockets')(io);