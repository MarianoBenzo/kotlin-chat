import React, {useState} from "react";
import {useContext} from "react";
import {ChatContext} from "components/chat/ChatProvider";
import ChatService from "services/ChatService";
import User from "models/User";
import styles from "./styles/chat.scss";

const Chat = React.memo(() => {
    const {users, messages} = useContext(ChatContext);

    const [message, setMessage] = useState('');

    const sendMessage = () => {
        ChatService.sendMessage("say", message)
    };

    return (
        <div className={styles.container}>
            <div className={styles.usersBox}>
                <div className={styles.title}>Users</div>
                {
                    users.map((user: User, index: number) => {
                        return <p className={styles.user} key={index}>{user.name}</p>
                    })
                }
            </div>

            <div className={styles.messagesBox}>
                <div className={styles.title}>Messages</div>

                <div className={styles.messages}>
                    {
                        messages.map((message: string, index: number) => {
                            return <p className={styles.message} key={index}>{message}</p>
                        })
                    }
                </div>

                <div className={styles.messageInput}>
                    <input type="text"
                           value={message}
                           placeholder="Write a message here"
                           onChange={e => setMessage(e.target.value.slice(0, 200))}/>

                    <button onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
});

export default Chat;
