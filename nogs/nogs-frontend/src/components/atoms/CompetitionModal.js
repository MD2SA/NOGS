import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import GameForm from "./GameForm";

export default function CompetitionModal({ isOpen, onClose }) {

    const [gamePhrase, setGamePhrase] = useState();

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

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
    }


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

                <h2 className="modal-title">Create New Competition</h2>
                <form onSubmit={handleSubmit} className="competition-form">
                    <div className="form-group">
                        <label htmlFor="competition-end-of-event">End of Event:</label>
                        <input
                            name="competition-end-of-event"
                            type="date"
                            className="form-input"
                        />
                        <label htmlFor="competition-capacity">Capacity:</label>
                        <input
                            name="competition-capacity"
                            type="number"
                            className="form-input"
                        />
                    </div>
                    <div className="competition-generate-game">
                        <GameForm setGamePhrase={setGamePhrase} />
                    </div>
                    <p className="phrase-result">{gamePhrase}</p>
                    <button type="submit" className="submit-button">
                        Create Competition
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}
