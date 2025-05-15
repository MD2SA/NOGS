import { useState } from "react";
import { useAuth } from "../AuthContext";
import Modal from "./Modal";


export default function LogoutButton() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { logout } = useAuth();

    return (
        <>
            <button onClick={() => setIsModalVisible(true)} className="logout-button">
                Logout
            </button>

            <Modal isOpen={isModalVisible}>
                <div className="logout-modal">
                    <p className="logout-modal-text">Are you sure you want to log out?</p>
                    <button onClick={logout} className="logout-modal-button">
                        Yes, log me out
                    </button>
                    <button onClick={() => setIsModalVisible(false)} className="logout-modal-button">
                        Cancel
                    </button>
                </div>
            </Modal>
        </>
    );
}
