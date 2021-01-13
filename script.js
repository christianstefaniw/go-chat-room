let app = {
    ws: undefined,
    container: undefined,
}

app.print = function (message) {
    let el = document.createElement("p")
    el.innerHTML = message
    app.container.append(el)
}

app.doSendMessage = function () {
    let messageRaw = document.querySelector('.input-message').value
    app.ws.send(JSON.stringify({
        Message: messageRaw
    }));

    let message = '<b>me</b>: ' + messageRaw
    app.print(message)

    document.querySelector('.input-message').value = ''
}

app.init = function () {
    if (!(window.WebSocket)) {
        alert('Your browser does not support WebSocket')
        return
    }

    let name = prompt('Enter your name please:') || "No name"
    document.querySelector('.username').innerText = name

    app.container = document.querySelector('.container')

    app.ws = new WebSocket("ws://localhost:8080/ws?username=" + name)

    app.ws.onopen = function() {
        let message = '<b>me</b>: connected'
        app.print(message)
    }

    app.ws.onmessage = function (event) {
        let res = JSON.parse(event.data)

        let message;
        if (res.Type === 'New User') {
            message = 'User <b>' + res.From + '</b>: connected'
        } else if (res.Type === 'Leave') {
            message = 'User <b>' + res.From + '</b>: disconnected'
        } else {
            message = '<b>' + res.From + '</b>: ' + res.Message
        }

        app.print(message)
    }

    app.ws.onclose = function () {
        let message = '<b>me</b>: disconnected'
        app.print(message)
    }
}

window.onload = app.init