import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GENERATE_GAME_URL } from '../../assets/urls/djangoUrls';

export default function GameForm({ setGamePhrase }) {
    const [value, setValue] = useState(10);
    const [error, setError] = useState('');
    const word_count = [10, 25, 50, 100];

    const generateGame = async () => {
        try {
            const response = await axios.get(GENERATE_GAME_URL, {
                params: { word_count: value }
            });
            setGamePhrase(response.data.phrase);
            setError('');
        } catch (err) {
            setError('Failed to load phrase. Please try again.');
        }
    };

    useEffect(() => {
        generateGame();
    }, [value]);

    return (
        <div className="game-form-section">
            <h3>Game Configuration</h3>

            <div className="word-options">
                <p>Select number of words</p>
                <div className="option-group">
                    {word_count.map((opt) => (
                        <label key={opt} className="option">
                            <input
                                type="radio"
                                name="wordCount"
                                value={opt}
                                checked={value === opt}
                                onChange={() => setValue(opt)}
                            />
                            <span className="custom-radio"></span>
                            {opt}
                        </label>
                    ))}
                </div>
            </div>

            {error && <div className="error-text">{error}</div>}
        </div>
    );
}
