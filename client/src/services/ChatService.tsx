import React from "react";
import MessageWS, {MessageWSType} from "models/MessageWS";

class ChatService {
    webSocket: WebSocket;

    constructor() {
        this.webSocket = new WebSocket(`ws://${location.hostname}:${location.port}/ws/chat`);
    }

    init(setUsers: Function, setMessages: Function) {
        this.webSocket.onmessage = (messageEvent: MessageEvent) => {
            const messageWS = JSON.parse(messageEvent.data)

            console.log(messageWS.type + ": ", messageWS.data)

            switch (messageWS.type) {
                case MessageWSType.MESSAGES:
                    setMessages(messageWS.data)
                    break;
                case MessageWSType.USERS:
                    setUsers(messageWS.data)
                    break;
            }
        }

        this.webSocket.onclose = () => {
           alert("Server Disconnect You")
        }

        this.webSocket.onopen = () => {
            let name = "";
            while (name === "") name = prompt("Enter your name");
            this.sendMessageWS(new MessageWS(MessageWSType.JOIN, name));
        }
    }

    sendMessageWS(messageWS: MessageWS) {
        if (messageWS.data !== "") {
            this.webSocket.send(JSON.stringify(messageWS));
        }
    }
}

export default new ChatService();
