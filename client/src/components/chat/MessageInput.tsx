import React, {useState} from "react";
import ChatService from "services/ChatService";
import {ClientMessageWSType} from "models/MessageWS";
import styles from "./styles/messageInput.scss";

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const inputOnChange = (e) => {
        setMessage(e.target.value.slice(0, 200))
        if (!isTyping) {
            setIsTyping(true)
            ChatService.sendMessageWS(ClientMessageWSType.STARTED_TYPING)
            setTimeout(
                () => {
                    setIsTyping(false)
                    ChatService.sendMessageWS(ClientMessageWSType.STOPPED_TYPING)
                },
                3000
            );
        }
    }

    const sendMessage = () => {
        if (validateMessage(message)) {
            ChatService.sendMessageWS(ClientMessageWSType.NEW_MESSAGE, message)
            setMessage("")
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    const validateMessage = (message: string): boolean => {
        return message.trim().length !== 0
    }

    return (
        <div className={styles.container}>
            <div className={styles.messageInput}>
                <input type="text"
                       value={message}
                       placeholder="Write a message here"
                       onChange={inputOnChange}
                       onKeyDown={handleKeyDown}/>

                <button onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default MessageInput;
