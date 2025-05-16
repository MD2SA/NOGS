import { useState } from "react";
import { useAuth } from "../AuthContext";
import Modal from "./Modal";


export default function LogoutButton() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { logout } = useAuth();

    return (
        <>
            <button
                onClick={() => setIsModalVisible(true)}
                className="logout-button"
                aria-label="Logout"
            >
                <span className="logout-button-text">Logout</span>
                <span className="logout-button-icon">→</span>
            </button>

            <Modal isOpen={isModalVisible}>
                <div className="logout-modal-content">
                    <h3 className="logout-modal-title">Confirm Logout</h3>
                    <p className="logout-modal-text">Are you sure you want to log out?</p>
                    <div className="logout-modal-actions">
                        <button
                            onClick={() => setIsModalVisible(false)}
                            className="logout-modal-button cancel"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={logout}
                            className="logout-modal-button confirm"
                        >
                            Yes, Log Out
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
