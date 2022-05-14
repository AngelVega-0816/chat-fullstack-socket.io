const { chat } = require('./db');

module.exports = function(io) {

    let users = {};

    io.on("connection", async socket => {

        let msgLoad = await chat.findAll();
        socket.emit("load old msg", msgLoad)


        socket.on("new user", (data, cb) => {
            if(users[data]) {
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNickames();
            }
        })

        socket.on("send message", async (data, cb) => {
            
            var msg = data.trim();
            if(msg.substr(0, 3) === "/w ") {
                msg = msg.substr(3);
                const index = msg.indexOf(" ")
                if(index !== -1) {
                    let name = msg.substring(0, index)
                    var msg = msg.substring(index + 1)
                    console.log(name, msg)
                    if(name in users) {
                        users[name].emit("whisper", {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        cb("Error! Please enter a Valid User")
                    }
                } else {
                    cb("Error! Please enter your message")
                }
            } else {
                await chat.create({
                    nick: socket.nickname,
                    msg,
                });
                io.sockets.emit("new message", {
                    msg: data,
                    nick: socket.nickname,
                })
            }
        })

        socket.on("disconnect", data => {
            if(!socket.nickname) return;
            delete users[socket.nickname]
            updateNickames()
        })

        function updateNickames () {
            io.sockets.emit("usernames", Object.keys(users))
        }

    })
}