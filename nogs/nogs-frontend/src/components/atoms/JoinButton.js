import { useState } from "react";
import { useAuth } from "../AuthContext";

export default function JoinButton({ joinURL, id, onJoinSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user, api } = useAuth();

    const handleJoin = () => {
        if (!user) {
            alert("Login to join");
            return;
        }
        setIsLoading(true);
        setError(null);
        api.post(joinURL(id))
            .then(response => {
                if (onJoinSuccess) onJoinSuccess();
            })
            .catch(error => {
                setError(error?.data?.error || "Failed to join");
            })
            .finally(() => setIsLoading(false));
    };


    return (
        <>
            {error && <p className="error-text">{error}</p>}
            <button
                onClick={handleJoin}
                disabled={isLoading}
            >
                {isLoading ? "Joining..." : "Join"}
            </button>
        </>
    );
}
