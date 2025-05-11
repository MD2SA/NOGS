import { useState } from "react";
import { COMPETITION_PARTICIPANTS_URL } from "../../assets/urls/djangoUrls";
import { useAuth } from "../AuthContext";

export default function JoinCompetitionButton({ competitionId, OnJoinSuccess }) {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { api, user } = useAuth();
    const handleJoin = () => {
        if (!user) {
            alert('Login to join');
            return;
        }
        setIsLoading(false);
        setError(null);
        api.post(COMPETITION_PARTICIPANTS_URL(competitionId))
            .then(response => {
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
