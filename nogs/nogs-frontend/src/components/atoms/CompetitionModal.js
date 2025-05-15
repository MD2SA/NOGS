import { useState } from "react";
import { COMPETITIONS_URL } from "../../assets/urls/djangoUrls";
import GameForm from "./GameForm";
import moment from "moment/moment";
import { useAuth } from "../AuthContext";
import Modal from "./Modal";

export default function CompetitionModal({ isOpen, onClose }) {
    const { api } = useAuth();
    const [gamePhrase, setGamePhrase] = useState('');
    const [formData, setFormData] = useState({
        endOfEvent: '',
        maxTries: '',
        capacity: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const formattedDate = formData.endOfEvent
                ? moment(formData.endOfEvent).toISOString()
                : null;

            await api.post(COMPETITIONS_URL, {
                end_of_event: formattedDate,
                max_tries: formData.maxTries || null,
                capacity: formData.capacity,
                phrase: gamePhrase
            }, { withCredentials: true });

            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create competition');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen}>
            <div className="competition-modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>

                <h2>Create New Competition</h2>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="settings-section">
                        <h3>Competition Settings</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>End of Event</label>
                                <input
                                    type="datetime-local"
                                    name="endOfEvent"
                                    value={formData.endOfEvent}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Max Tries <span>(optional)</span></label>
                                <input
                                    type="number"
                                    name="maxTries"
                                    min="0"
                                    value={formData.maxTries}
                                    onChange={handleChange}
                                    placeholder="No limit"
                                />
                            </div>

                            <div className="form-group">
                                <label>Capacity</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    min="1"
                                    required
                                    value={formData.capacity}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <GameForm setGamePhrase={setGamePhrase} />

                    {gamePhrase && (
                        <div className="phrase-preview">
                            <div className="preview-label">Generated Phrase:</div>
                            <div className="phrase-text">{gamePhrase}</div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting || !gamePhrase}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Competition'}
                    </button>
                </form>
            </div>
        </Modal>
    );
}
