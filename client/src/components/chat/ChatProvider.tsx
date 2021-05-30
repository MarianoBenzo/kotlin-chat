import * as React from "react";
import {useEffect, useState} from "react";
import ChatService from "services/ChatService";
import User from "models/User";

interface Props {
    children: JSX.Element[] | JSX.Element
}

export interface ChatContextProps {
    users: User[];
    messages: string[];
}

export const ChatContext = React.createContext<ChatContextProps>({
    users: [],
    messages: []
});

const ChatProvider = (props: Props) => {

    const {children} = props;

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        ChatService.init(setUsers, setMessages);
    }, []);

    const context: ChatContextProps = {
        users: users,
        messages: messages
    };

    return (
        <ChatContext.Provider value={context}>
            {children}
        </ChatContext.Provider>
    )
};

export default ChatProvider;
