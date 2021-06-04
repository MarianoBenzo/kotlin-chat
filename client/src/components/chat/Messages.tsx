import React, {useEffect, useRef, useState} from "react";
import Message, {MessageType} from "models/Message";
import MessageInput from "components/chat/MessageInput";
import User from "models/User";
import styles from "./styles/messages.scss";

interface Props {
    messages: Array<Message>
    usersTyping: Array<User>
}

const Messages = (props: Props) => {
    const {messages, usersTyping} = props;

    const [isBottom, setIsBottom] = useState(true);
    const [newMessages, setNewMessages] = useState(false);

    const messagesEndRef = useRef(null)

    useEffect(() => {
        scrollBottom()
    }, []);

    useEffect(() => {
        if (isBottom) {
            scrollBottom()
        } else {
            setNewMessages(true)
        }
    }, [messages]);

    const scrollBottom = () => {
        messagesEndRef.current?.scrollIntoView()
    }

    const handleScroll = (e) => {
        const isBottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (isBottom) {
            setIsBottom(true)
            setNewMessages(false)
        } else {
            setIsBottom(false)
        }
    }

    const usersTypingText = () => {
        switch (usersTyping.length) {
            case 0:
                return " "
            case 1:
                return `${usersTyping[0].name} is typing...`
            default:
                return `${usersTyping.slice(0, usersTyping.length - 1).map(user => user.name).join(", ")} and ${usersTyping[usersTyping.length - 1].name} are typing...`
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>Messages</div>

            <div className={styles.messages} onScroll={handleScroll}>
                {
                    messages.map((message: Message, index: number) => {
                        switch (message.type) {
                            case MessageType.OWN:
                                return (
                                    <div className={styles.ownMessage} key={index}>
                                        <div className={styles.bubble}>
                                            <p>{message.text}</p>
                                        </div>
                                    </div>
                                )
                            case MessageType.USER:
                                return (
                                    <div className={styles.userMessage} key={index}>
                                        <div className={styles.bubble}>
                                            <p className={styles.userName}>{message.userName}</p>
                                            <p>{message.text}</p>
                                        </div>
                                    </div>
                                )
                            case MessageType.SERVER:
                                return (
                                    <div className={styles.serverMessage} key={index}>
                                        <p>
                                            {message.userName} {message.text}
                                        </p>
                                    </div>
                                )
                        }
                    })
                }
                <div className={styles.usersTyping}>{usersTypingText()}</div>
                <div ref={messagesEndRef}/>
            </div>
            {newMessages &&
                <div className={styles.newMessages}>
                    <button onClick={scrollBottom}>New messages</button>
                </div>
            }
            <MessageInput/>
        </div>
    );
}

export default Messages;
