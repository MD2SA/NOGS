import { useState } from "react";
import { REPORT_URL } from "../../assets/urls/djangoUrls";
import { useAuth } from "../AuthContext";
import ConfirmationModal from "./ConfirmationModal";
import Modal from "./Modal";


export default function ReportModal({ isOpen, userData, onClose }) {
    const { api } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("")

    const handleReport = async () => {
        try {
            await api.post(REPORT_URL, {
                user: userData.user,
                description: description
            });
            setIsModalVisible(false);
            setError('');
            onClose();
        } catch (error) {
            setError('Report failed');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsModalVisible(true);
    };

    return (
        <>
            <Modal isOpen={isOpen}>
                <div className="team-modal-container">
                    <button
                        className="team-modal-close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        &times;
                    </button>

                    <form className="team-form-wrapper" onSubmit={handleSubmit}>
                        <div className="team-form-group">
                            <label htmlFor="team-description" className="team-form-label">
                                Description:
                            </label>
                            <textarea
                                id="team-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="team-form-input team-form-textarea"
                                placeholder="Describe the issue"
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="team-submit-btn">
                            Report
                        </button>
                    </form>
                </div>
            </Modal>

            <ConfirmationModal
                isOpen={isModalVisible}
                close={onClose}
                title="Report"
                message={`report ${userData?.username || "this user"}`}
                onConfirmation={handleReport}
            />
        </>
    );
}
