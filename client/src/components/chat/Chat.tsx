import React, {useEffect, useRef, useState} from "react";
import {useContext} from "react";
import {ChatContext} from "components/chat/ChatProvider";
import ChatService from "services/ChatService";
import User from "models/User";
import styles from "./styles/chat.scss";
import Message, {MessageType} from "models/Message";
import MessageWS, {MessageWSType} from "models/MessageWS";

const Chat = React.memo(() => {
    const {users, messages} = useContext(ChatContext);

    const [message, setMessage] = useState('');
    const [isBottom, setIsBottom] = useState(true);

    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView()
    }, []);

    useEffect(() => {
        if (isBottom) {
            messagesEndRef.current?.scrollIntoView()
        }
    }, [messages]);

    const handleScroll = (e) => {
        const isBottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (isBottom) {
            setIsBottom(true)
        } else {
            setIsBottom(false)
        }
    }

    const sendMessage = () => {
        ChatService.sendMessageWS(new MessageWS(MessageWSType.SAY, message))
        setMessage("")
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.usersBox}>
                <div className={styles.title}>Users Online</div>
                    <div className={styles.users}>
                        {
                            users.map((user: User, index: number) => {
                                return <p className={styles.userName} key={index}>{user.name}</p>
                            })
                        }
                    </div>
            </div>

            <div className={styles.messagesBox}>
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
                    <div ref={messagesEndRef}/>
                </div>

                <div className={styles.messageInput}>
                    <input type="text"
                           value={message}
                           placeholder="Write a message here"
                           onChange={e => setMessage(e.target.value.slice(0, 200))}
                           onKeyDown={handleKeyDown}/>

                    <button onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
});

export default Chat;
