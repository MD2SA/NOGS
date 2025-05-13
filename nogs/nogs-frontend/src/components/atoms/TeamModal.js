import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CREATE_TEAM_URL } from "../../assets/urls/djangoUrls";
import {useAuth} from "../AuthContext";



export default function TeamModal({ isOpen, onClose }) {
    const {api} = useAuth();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.classList.add("modal-open");
        } else {
            document.body.style.overflow = "auto";
            document.body.classList.remove("modal-open");
        }

        return () => {
            document.body.style.overflow = "auto";
            document.body.classList.remove("modal-open");
        };
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(
                CREATE_TEAM_URL,
                {name,description},
            );
            alert("Team created successfully!");
            onClose();
        } catch (error) {
            console.error("Error creating team:", error);
            alert("Error creating team.");
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <button
                    className="modal-close-button"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    &times;
                </button>
                <h2 className="modal-title">Create New Team</h2>
                <form className="team-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="team-name">Team Name:</label>
                        <input
                            id="team-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="form-input"
                        />
                        <label htmlFor="team-description">Description:</label>
                        <textarea
                            id="team-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Create Team
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}
