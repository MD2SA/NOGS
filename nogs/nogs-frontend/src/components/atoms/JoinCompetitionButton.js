import axios from "axios";
import { useState } from "react";
import { COMPETITION_PARTICIPANTS_URL, COMPETITION_URL } from "../../assets/urls/djangoUrls";
import { useAuth } from "../AuthContext";

export default function JoinCompetitionButton({ competitionId, OnJoinSuccess }) {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user } = useAuth();
    const handleJoin = () => {
        if (!user) {
            alert('Login to join');
            return;
        }
        setIsLoading(false);
        setError(null);
        axios.post(COMPETITION_URL(competitionId), { withCredentials: true })
            .then(response => {
                console.log(response);
                if (OnJoinSuccess) OnJoinSuccess();
            })
            .catch(error => {
                console.log(error);
                setError(error?.data?.error || "Failed to join competition");
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
                {isLoading ? 'Joining...' : 'Join'}
            </button>
        </>
    );
}
