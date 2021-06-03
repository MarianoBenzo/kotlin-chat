import React from "react";
import styles from "./styles/modalContainer.scss";

interface Props {
    show: boolean
    children: JSX.Element[] | JSX.Element
}

const ModalContainer = (props: Props) => {
    const {show, children} = props

    if(!show) {
         return null
    }

    return (
        <div className={styles.container}>
            <div className={styles.modal}>
                {children}
            </div>
        </div>
    );
};

export default ModalContainer;
