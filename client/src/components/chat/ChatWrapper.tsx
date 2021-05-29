import React from "react";
import ChatProvider from "components/chat/ChatProvider";
import Chat from "./Chat";

const ChatWrapper = (): JSX.Element => {
    return (
        <ChatProvider>
            <Chat/>
        </ChatProvider>
    );
};

export default ChatWrapper;
