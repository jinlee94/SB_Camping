import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ isOpen, onRequestClose, onConfirm, title, message }) => {
    return (
        <Modal show={isOpen} onHide={onRequestClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onRequestClose}>
                    취소
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    삭제
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;
