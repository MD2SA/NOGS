import { useState } from "react";
import { useAuth } from "../AuthContext";
import ConfirmationModal from "./ConfirmationModal";
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
            <ConfirmationModal isOpen={isModalVisible} close={() => setIsModalVisible(false)} title={"Logout"} message={"log out"} onConfirmation={logout} />
        </>
    );
}
