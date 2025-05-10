import React, { useState } from 'react';
import axios from 'axios';
import { GENERATE_GAME_URL } from '../../assets/urls/djangoUrls';

export default function GameForm({ setGamePhrase }) {
    const [value, setValue] = useState(10);
    const [error, setError] = useState('');

    const word_count = [10, 25, 50, 100];

    const generateGame = async (e) => {
        e.preventDefault();
        if (value === null) {
            alert('Please select an option.');
            return;
        }
        try {
            const response = await axios.get(GENERATE_GAME_URL, {
                params: {
                    word_count: value,
                },
            });
            setGamePhrase(response.data.phrase);

            setError('');
        } catch (err) {
            setError('Failed to load phrase. Please try again.');
        }
    };

    return (
        <div className="game-form">
            <div className="section">
                <p className="section-title">
                    Select number of words
                </p>
                {word_count.map((opt) => (
                    <label key={opt} htmlFor={`value-${opt}`} className="option">
                        <input
                            id={`value-${opt}`}
                            type="radio"
                            name="value"
                            value={opt}
                            checked={value === opt}
                            onChange={() => setValue(opt)}
                        />
                        {opt}
                    </label>
                ))}
            </div>
            {error && <p className="error-message">{error}</p>}
            <button onClick={generateGame} >Generate game</button>
        </div>
    );
}

