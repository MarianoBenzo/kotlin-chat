import React from "react";
import ChatProvider from "components/chat/ChatProvider";
import Chat from "./Chat";
import ModalProvider from "components/modal/ModalProvider";

const ChatWrapper = () => {
    return (
        <ModalProvider>
            <ChatProvider>
                <Chat/>
            </ChatProvider>
        </ModalProvider>
    );
};

export default ChatWrapper;
