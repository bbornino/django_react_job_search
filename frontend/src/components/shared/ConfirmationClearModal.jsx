import React from 'react';
import ConfirmationModal from './ConfirmationModal';

const ClearConfirmationModal = ({ isOpen, toggle, onClear }) => {
    return (
        <ConfirmationModal
            isOpen={isOpen}
            toggle={toggle}
            title="Confirm Clear"
            message="Are you sure you want to clear this data? This action cannot be undone."
            confirmLabel="Clear"
            cancelLabel="Cancel"
            onConfirm={onClear}
        />
    );
};

export default ClearConfirmationModal;
