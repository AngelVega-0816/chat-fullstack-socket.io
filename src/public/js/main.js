let socket = io();

$(function () {
    
    //obtaining DOM elements from the interface
    let $messageForm = $('#message-form')
    let $messageBox = $('#message')
    let $chat = $('#chat')


    //obtaining DOM elements from the nicknameForm
    const $nickForm = $('#nickForm')
    const $nickError = $('#nickError')
    const $nickname = $('#nickname')
    const $users = $("#usernames")

    function scrollDown() {
        let scroll = document.getElementById("chat")
        scroll.scrollTop = scroll.scrollHeight; 
    }

    function displayMsg(data) {
        $chat.append(`<b>${data.nick}</b>: ${data.msg}<br/>`)
        scrollDown()
    }

// usernames
    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit("new user", $nickname.val(), function (data) {
            if(data) {
                $("#nickWrap").hide();
                $("#contentWrap").show();
            } else $nickError.html(`
                <div class="alert alert-danger">
                    That username already exist.
                </div>
            `)
        })
        $nickname.val("");
    })

    //events
    $messageForm.submit(el => {
        el.preventDefault();
        socket.emit("send message", $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        })
        $messageBox.val("")
    });


    socket.on("new message", data => {
        displayMsg(data)
    })

    socket.on("usernames", data => {
        let html = "";

        data.forEach(el => {
            html += `<p><i class="fas fa-user"></i> ${el}</p>`
        })
        $users.html(html)

    })

    socket.on("whisper", data => {
        $chat.append(`<p class="whisper"><b>${data.nick}</b> ${data.msg}</p>`)
    })

    socket.on("load old msg", data => {
        data.forEach(el => {
            displayMsg(el)
        })
        scrollDown()
    })


    

})