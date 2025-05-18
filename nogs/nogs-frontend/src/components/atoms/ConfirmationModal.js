import Modal from "../atoms/Modal";


export default function ConfirmationModal({ isOpen, close, title, message, onConfirmation }) {

    return (
        <Modal isOpen={isOpen}>
            <div className="logout-modal-content">
                <h3 className="logout-modal-title">Confirm {title}</h3>
                <p className="logout-modal-text">Are you sure you want to {message}?</p>
                <div className="logout-modal-actions">
                    <button
                        onClick={close}
                        className="logout-modal-button cancel"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirmation}
                        className="logout-modal-button confirm"
                    >
                        Yes, {message}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
