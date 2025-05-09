import { useState, useEffect } from "react";
import axios from "axios";
import CompetitionModal from "./CompetitionModal";
import { ME_URL } from "../../assets/urls/djangoUrls";
import "../../css/CreateCompetition.css"

export default function CreateCompetition() {
    const [isStaff, setIsStaff] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const askPermissions = async () => {
            try {
                const response = await axios.get(ME_URL, { withCredentials: true });
                console.log(response);
                setIsStaff(response?.data?.is_staff || false);
            } catch (error) {
                console.error("Error checking user data", error);
                setIsStaff(false);
            }
        };
        askPermissions();
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
                        className="create-competition-button"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create Competition
                    </button>
                    <CompetitionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </>
            )}
        </>
    );
}
