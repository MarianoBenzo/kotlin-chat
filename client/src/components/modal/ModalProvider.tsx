import React from "react";
import {useState} from "react";
import ModalContainer from "components/modal/ModalContainer";

interface Props {
    children: JSX.Element[] | JSX.Element
}

export interface ModalContextProps {
    showModal: (modal: JSX.Element[] | JSX.Element) => void
    hideModal: () => void
}

export const ModalContext = React.createContext<ModalContextProps>({} as ModalContextProps);

const ModalProvider = (props: Props): JSX.Element => {
    const {children} = props;

    const [modal, setModal] = useState(null);
    const [show, setShow] = useState(false);

    const showModal = (modal: JSX.Element[] | JSX.Element) => {
        setModal(modal)
        setShow(true)
    }

    const hideModal = () => setShow(false)

    const context: ModalContextProps = {
        showModal: showModal,
        hideModal: hideModal
    };

    return (
        <ModalContext.Provider value={context}>
            <ModalContainer show={show}>
                {modal}
            </ModalContainer>
            {children}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
