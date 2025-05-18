import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CREATE_TEAM_URL } from "../../assets/urls/djangoUrls";
import { useAuth } from "../AuthContext";
import Modal from "./Modal";



export default function CreateTeamModal({ isOpen, onClose }) {
    const { api } = useAuth();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(
                CREATE_TEAM_URL,
                { name, description },
            );
            alert("Team created successfully!");
            onClose();
        } catch (error) {
            console.error("Error creating team:", error);
            alert("Error creating team.");
        }
    };

    return (
        <Modal isOpen={isOpen}>
            <div className="team-modal-container">
                <button
                    className="team-modal-close-btn"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    &times;
                </button>

                <h2 className="team-modal-title">Create New Team</h2>

                <form className="team-form-wrapper" onSubmit={handleSubmit}>
                    <div className="team-form-group">
                        <label htmlFor="team-name" className="team-form-label">
                            Team Name:
                        </label>
                        <input
                            id="team-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="team-form-input"
                            placeholder="Enter team name"
                        />
                    </div>

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
                            placeholder="Brief description of your team"
                        />
                    </div>

                    <button type="submit" className="team-submit-btn">
                        Create Team
                    </button>
                </form>
            </div>
        </Modal >
    );
}
