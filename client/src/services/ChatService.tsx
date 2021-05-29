import React from "react";

class ChatService {
    webSocket: WebSocket;

    constructor() {
        this.webSocket = new WebSocket(`ws://${location.hostname}:${location.port}/ws/chat`);
    }

    init(setUsers: Function, setMessages: Function) {
        this.webSocket.onmessage = (messageEvent: MessageEvent) => {
            const messageData = JSON.parse(messageEvent.data)

            console.log(messageData.type + ": ", messageData.data)

            switch (messageData.type) {
                case "messages":
                    setMessages(messageData.data)
                    break;
                case "users":
                    setUsers(messageData.data)
                    break;
            }
        }

        this.webSocket.onclose = () => {
           alert("Server Disconnect You")
        }

        this.webSocket.onopen = () => {
            let name = "";
            while (name === "") name = prompt("Enter your name");
            this.sendMessage("join", name);
        }
    }

    sendMessage(type, data) {
        if (data !== "") {
            this.webSocket.send(JSON.stringify({type: type, data: data}));
        }
    }
}

export default new ChatService();
