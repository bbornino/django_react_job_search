import React from 'react';
import ConfirmationModal from './ConfirmationModal';

const DeleteConfirmationModal = ({ isOpen, toggle, onDelete }) => {
    return (
        <ConfirmationModal
            isOpen={isOpen}
            toggle={toggle}
            title="Confirm Deletion"
            message="Are you sure you want to delete this entry? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={onDelete}
        />
    );
};

export default DeleteConfirmationModal;
