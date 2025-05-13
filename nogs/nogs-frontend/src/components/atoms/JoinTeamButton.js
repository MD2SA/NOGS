import { useState } from "react";
import {MY_TEAM_URL, TEAM_JOIN_URL} from "../../assets/urls/djangoUrls";
import { useAuth } from "../AuthContext";

export default function JoinTeamButton({ teamId, onJoinSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user, api } = useAuth(); // pega o api do context

    const handleJoin = () => {
        if (!user) {
            alert("Login to join a team");
            return;
        }
        setIsLoading(true);
        setError(null);
        api.post(TEAM_JOIN_URL(teamId)) // igual à competição
            .then(response => {
                if (onJoinSuccess) onJoinSuccess();
            })
            .catch(error => {
                console.error(error);
                setError(error?.data?.error || "Failed to join team");
            })
            .finally(() => setIsLoading(false));
    };




    return (
        <>
            {error && <p className="error-message">{error}</p>}
            <button
                onClick={handleJoin}
                disabled={isLoading}
                className="join-team-button"
            >
                {isLoading ? "Joining..." : "Join Team"}
            </button>
        </>
    );
}
