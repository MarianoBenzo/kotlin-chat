import React, {useEffect} from "react";
import {useContext} from "react";
import {ChatContext} from "components/chat/ChatProvider";
import {ModalContext} from "components/modal/ModalProvider";
import ConnectionModal from "components/modal/ConnectionModal";
import Messages from "components/chat/Messages";
import Users from "components/chat/Users";
import styles from "./styles/chat.scss";

const Chat = React.memo(() => {
    const {showModal, hideModal} = useContext(ModalContext)
    const {users, messages, usersTyping} = useContext(ChatContext);

    useEffect(() => {
        showModal(<ConnectionModal hideModal={hideModal}/>)
    }, []);

    return (
        <div className={styles.container}>
            <Users users={users}/>
            <Messages messages={messages} usersTyping={usersTyping}/>
        </div>
    );
});

export default Chat;
