import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./CompetitionModal"; // adjust the import path as needed
import { ME_URL } from "../../assets/urls/djangoUrls";

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

                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <h2 className="modal-title">Create New Competition</h2>
                        <form className="competition-form">
                            <div className="form-group">
                                <label htmlFor="competition-name">Competition Name:</label>
                                <input
                                    id="competition-name"
                                    type="text"
                                    className="form-input"
                                />
                            </div>
                            <button type="submit" className="submit-button">
                                Create Competition
                            </button>
                        </form>
                    </Modal>
                </>
            )}
        </>
    );
}
