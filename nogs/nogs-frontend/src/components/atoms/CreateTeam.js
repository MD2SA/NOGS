import { useState, useEffect } from "react";
import axios from "axios";
import TeamModal from "./TeamModal";
import { ME_URL } from "../../assets/urls/djangoUrls";
import "../../css/CreateTeam.css";

export default function CreateTeam() {
    const [isStaff, setIsStaff] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const response = await axios.get(ME_URL, { withCredentials: true });
                setIsStaff(response?.data?.is_staff || false);
            } catch (error) {
                console.error("Error checking user permissions", error);
                setIsStaff(false);
            }
        };
        checkPermissions();
    }, []);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {isStaff && (
                <>
                    <button
                        className="create-team-button"
                        onClick={handleClick}
                    >
                        Create Team
                    </button>
                    <TeamModal isOpen={isModalOpen} onClose={handleCloseModal} />
                </>
            )}
        </>
    );
}
