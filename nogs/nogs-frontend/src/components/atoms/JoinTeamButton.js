import axios from "axios";
import { useState } from "react";
import { TEAM_JOIN_URL } from "../../assets/urls/djangoUrls";
import { useAuth } from "../AuthContext";

export default function JoinTeamButton({ teamId, onJoinSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user } = useAuth();

    const handleJoin = () => {
        if (!user) {
            alert("Login to join a team");
            return;
        }

        setIsLoading(true);
        setError(null);

        axios
            .post(TEAM_JOIN_URL(teamId), {}, { withCredentials: true })
            .then((response) => {
                console.log(response);
                if (onJoinSuccess) onJoinSuccess();
            })
            .catch((error) => {
                console.error(error);
                setError(error?.response?.data?.error || "Failed to join team");
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
