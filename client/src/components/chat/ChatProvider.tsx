import * as React from "react";
import {useEffect, useState} from "react";
import ChatService from "services/ChatService";
import User from "models/User";
import Message from "models/Message";

interface Props {
    children: JSX.Element[] | JSX.Element
}

export interface ChatContextProps {
    users: Array<User>;
    messages: Array<Message>;
    usersTyping: Array<User>;
}

export const ChatContext = React.createContext<ChatContextProps>({
    users: [],
    messages: [],
    usersTyping: []
});

const ChatProvider = (props: Props) => {

    const {children} = props;

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [usersTyping, setUsersTyping] = useState([]);

    const addUser = (newUser: User) => {
        setUsers(users => [...users, newUser])
    }

    const removeUser = (deletedUser: User) => {
        setUsers(users => users.filter(
            user => user.id !== deletedUser.id
        ))
    }

    const addMessage = (newMessage: Message) => {
        setMessages(messages => [...messages, newMessage])
    }

    const addUserTyping = (newUserTyping: User) => {
        setUsersTyping(usersTyping => [...usersTyping, newUserTyping])
    }

    const removeUserTyping = (deletedUserTyping: User) => {
        setUsersTyping(usersTyping => usersTyping.filter(
            userTyping => userTyping.id !== deletedUserTyping.id
        ))
    }

    useEffect(() => {
        ChatService.init(setUsers, addUser, removeUser, addMessage, addUserTyping, removeUserTyping);
    }, []);

    const context: ChatContextProps = {
        users: users,
        messages: messages,
        usersTyping: usersTyping
    };

    return (
        <ChatContext.Provider value={context}>
            {children}
        </ChatContext.Provider>
    )
};

export default ChatProvider;
