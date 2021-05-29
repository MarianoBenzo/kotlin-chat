import React, {useState} from "react";
import {useContext} from "react";
import {ChatContext} from "components/chat/ChatProvider";
import ChatService from "services/ChatService";
import User from "models/User";

const Chat = React.memo(() => {
    const {users, messages} = useContext(ChatContext);

    const [message, setMessage] = useState('');

    const sendMessage = () => {
        ChatService.sendMessage("say", message)
    };

    return (
        <div>
            <div>
                <p>Users:</p>
                {
                    users.map((user: User, index: number) => {
                        return <p key={index}>{user.name}</p>
                    })
                }
            </div>

            <div>
                <p>Messages: </p>
                {
                    messages.map((message: string, index: number) => {
                        return <p key={index}>{message}</p>
                    })
                }
            </div>

            <input type="text"
                   value={message}
                   placeholder="Message"
                   onChange={e => setMessage(e.target.value.slice(0, 200))}/>
            <button onClick={sendMessage}>
                Send
            </button>
        </div>
    );
});

export default Chat;
