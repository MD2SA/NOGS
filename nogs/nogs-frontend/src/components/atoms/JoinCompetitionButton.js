import axios from "axios";
import { useState } from "react";


export default function JoinCompetitionButton({ competitionId, OnJoinSuccess }) {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleJoin = () => {
        setIsLoading(false);
        setError(null);
        axios.post(
            `http://localhost:8000/competition/api/${competitionId}/join`,
            {},
            { withCredentials: true }
        )
            .then(response => {
                if (OnJoinSuccess) OnJoinSuccess();
            })
            .catch(error => {
                setError(error.response?.data?.detail || "Failed to join competition");
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <>
            {error && <p className="error-message">{error}</p>}
            <button
                onClick={handleJoin}
                disabled={isLoading}
                className="competition-button"
            >
                {isLoading ? 'Joining...' : 'Join Competition'}
            </button>
        </>
    );
}
