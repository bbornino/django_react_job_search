import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const ConfirmationModal = ({ isOpen, toggle, title, message, confirmLabel, cancelLabel, onConfirm }) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{title}</ModalHeader>
            <ModalBody>{message}</ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>{cancelLabel || 'Cancel'}</Button>
                <Button color="danger" onClick={onConfirm}>{confirmLabel || 'Confirm'}</Button>
            </ModalFooter>
        </Modal>
    );
};

export default ConfirmationModal;
