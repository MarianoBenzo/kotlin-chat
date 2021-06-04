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
                { usersTyping.length != 0 &&
                <div className={styles.usersTyping}>
                    {usersTyping.length === 1 ?
                        `${usersTyping[0].name} is typing...`
                        :
                        `${usersTyping.slice(0, usersTyping.length - 1).map(user => user.name).join(", ")} and ${usersTyping[usersTyping.length - 1].name} are typing...`
                    }
                </div>
                }
                <div ref={messagesEndRef}/>
            </div>
            <MessageInput/>
        </div>
    );
}

export default Messages;
