import React from "react";
import MessageWS, {ClientMessageWSType, ServerMessageWSType} from "models/MessageWS";

class ChatService {
    webSocket: WebSocket;

    constructor() {
        this.webSocket = new WebSocket(`wss://${location.hostname}:${location.port}/ws/chat`);
    }

    init(
        setUsers: Function,
        addUser: Function,
        removeUser: Function,
        addMessage: Function,
        addUserTyping: Function,
        removeUserTyping: Function
    ) {
        this.webSocket.onmessage = (messageEvent: MessageEvent) => {
            const messageWS = JSON.parse(messageEvent.data)

            switch (messageWS.type) {
                case ServerMessageWSType.USERS:
                    setUsers(messageWS.data)
                    break;
                case ServerMessageWSType.ADD_USER:
                    addUser(messageWS.data)
                    break;
                case ServerMessageWSType.REMOVE_USER:
                    removeUser(messageWS.data)
                    break;
                case ServerMessageWSType.ADD_MESSAGE:
                    addMessage(messageWS.data)
                    break;
                case ServerMessageWSType.ADD_USER_TYPING:
                    addUserTyping(messageWS.data)
                    break;
                case ServerMessageWSType.REMOVE_USER_TYPING:
                    removeUserTyping(messageWS.data)
                    break;
            }

            console.log(`Received: ${messageWS.type}`, messageWS.data)
        }

        this.webSocket.onclose = () => {
           alert("Server Disconnect You")
        }
    }

    sendMessageWS(type: ClientMessageWSType, data?: any) {
        this.webSocket.send(JSON.stringify(new MessageWS(type, data)));
    }
}

export default new ChatService();
