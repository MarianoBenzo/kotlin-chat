import React, {useState} from "react";
import {ClientMessageWSType} from "models/MessageWS";
import ChatService from "services/ChatService";
import styles from "./styles/connectionModal.scss";

interface Props {
    hideModal: () => void
}

const ConnectionModal = (props: Props) => {
    const {hideModal} = props

    const [name, setName] = useState("");
    const [nameInvalid, setNameInvalid] = useState(false);

    const sendName = () => {
        if (!validateName(name)) {
            ChatService.sendMessageWS(ClientMessageWSType.NEW_USER, name)
            hideModal()
        } else {
            setNameInvalid(true)
        }
    }

    const validateName = (name: string): boolean => {
        return name.trim().length === 0
    }

    const inputOnChange = (e) => {
        const validName = e.target.value.slice(0, 40)
        setName(validName)
        setNameInvalid(validateName(validName))
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendName()
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>Welcome!</div>
            <div className={styles.nameInvalid}>{nameInvalid ? "Username invalid" : ""}</div>
            <div className={styles.nameInput + " " + (nameInvalid ? styles.nameInvalidInput : "")}>
                <input type="text"
                       value={name}
                       placeholder="Enter your username here"
                       onChange={inputOnChange}
                       onKeyDown={handleKeyDown}/>

                <button onClick={sendName}>
                    Done
                </button>
            </div>
        </div>
    );
};

export default ConnectionModal;
