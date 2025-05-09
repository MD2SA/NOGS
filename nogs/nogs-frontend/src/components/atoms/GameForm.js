import React, { useState } from 'react';
import axios from 'axios';
import { GENERATE_GAME_URL } from '../../assets/urls/djangoUrls';

export default function GameForm() {
    const [mode, setMode] = useState('words');
    const [value, setValue] = useState(null);
    const [phrase, setPhrase] = useState('');
    const [error, setError] = useState('');

    const options = {
        words: [10, 25, 50, 100],
        time: [15, 30, 60, 120],
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (value === null) {
            alert('Please select an option.');
            return;
        }
        try {
            const response = await axios.get(GENERATE_GAME_URL, {
                params: {
                    mode,
                    time_seconds: mode === 'time' ? value : null,
                    word_count: mode === 'words' ? value : null,
                },
            });
            setPhrase(response.data.phrase);
            setError('');
        } catch (err) {
            console.error('Error loading the test:', err);
            setError('Failed to load phrase. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="game-form">
            <div className="section">
                <p className="section-title">Choose Mode:</p>
                {['words', 'time'].map((type) => (
                    <label key={type} htmlFor={`mode-${type}`} className="option">
                        <input
                            id={`mode-${type}`}
                            type="radio"
                            name="mode"
                            value={type}
                            checked={mode === type}
                            onChange={() => {
                                setMode(type);
                                setValue(null);
                            }}
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                ))}
            </div>

            <div className="section">
                <p className="section-title">
                    Select {mode === 'words' ? 'Word Count' : 'Time (sec)'}:
                </p>
                {options[mode].map((opt) => (
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

            <button type="submit" className="submit-btn">Generate Game</button>

            {phrase && <p className="phrase-result">{phrase}</p>}
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}

