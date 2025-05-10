import axios from "axios";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { COMPETITIONS_URL } from "../../assets/urls/djangoUrls";
import GameForm from "./GameForm";
import moment from "moment/moment";

export default function CompetitionModal({ isOpen, onClose }) {
    const [gamePhrase, setGamePhrase] = useState('');
    const [formData, setFormData] = useState({
        endOfEvent: '',
        maxTries: '',
        capacity: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const formattedDate = formData.endOfEvent
                ? moment(formData.endOfEvent).toISOString()
                : null;

            await axios.post(COMPETITIONS_URL, {
                end_of_event: formattedDate,
                max_tries: formData.maxTries || null,
                capacity: formData.capacity,
                phrase: gamePhrase
            }, { withCredentials: true });

            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create competition');
            console.error('Error creating competition:', err);
        } finally {
            setIsSubmitting(false);
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

                <h2 className="modal-title">Create New Competition</h2>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="competition-form">
                    <div className="form-group sub-container">
                        <div className="competition-detail">
                            <label htmlFor="endOfEvent">End of Event:</label>
                            <input
                                id="endOfEvent"
                                name="endOfEvent"
                                type="datetime-local"
                                value={formData.endOfEvent}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <div className="competition-detail">
                            <label htmlFor="maxTries">Max tries (empty for no max):</label>
                            <input
                                id="maxTries"
                                name="maxTries"
                                type="number"
                                min="0"
                                value={formData.maxTries}
                                onChange={handleChange}
                                placeholder="No limit"
                                className="form-input"
                            />
                        </div>

                        <div className="competition-detail">
                            <label htmlFor="capacity">Capacity:</label>
                            <input
                                id="capacity"
                                name="capacity"
                                type="number"
                                min="1"
                                required
                                value={formData.capacity}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="competition-generate-game">
                        <GameForm setGamePhrase={setGamePhrase} />
                    </div>

                    {gamePhrase && <p className="phrase-result">{gamePhrase}</p>}

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Competition'}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}
