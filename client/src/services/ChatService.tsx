import React from "react";
import MessageWS, {MessageWSType} from "models/MessageWS";

class ChatService {
    webSocket: WebSocket;

    constructor() {
        this.webSocket = new WebSocket(`ws://${location.hostname}:${location.port}/ws/chat`);
    }

    init(
        setUsers: Function,
        addUser: Function,
        removeUser: Function,
        addMessage: Function,
        setUsersWriting: Function
    ) {
        this.webSocket.onmessage = (messageEvent: MessageEvent) => {
            const messageWS = JSON.parse(messageEvent.data)

            switch (messageWS.type) {
                case MessageWSType.USERS:
                    setUsers(messageWS.data)
                    break;
                case MessageWSType.ADD_USER:
                    addUser(messageWS.data)
                    break;
                case MessageWSType.REMOVE_USER:
                    removeUser(messageWS.data)
                    break;
                case MessageWSType.ADD_MESSAGE:
                    addMessage(messageWS.data)
                    break;
                case MessageWSType.USERS_WRITING:
                    setUsersWriting(messageWS.data)
                    break;
            }

            console.log(`Received: ${messageWS.type}`, messageWS.data)
        }

        this.webSocket.onclose = () => {
           alert("Server Disconnect You")
        }

        this.webSocket.onopen = () => {
            let name = "";
            while (name === "") name = prompt("Enter your name");
            this.sendMessageWS(new MessageWS(MessageWSType.NEW_USER, name));
        }
    }

    sendMessageWS(messageWS: MessageWS) {
        if (messageWS.data !== "") {
            this.webSocket.send(JSON.stringify(messageWS));
        }
    }
}

export default new ChatService();
