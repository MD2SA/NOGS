// LeaveTeamButton.js
import axios from "axios";
import { useAuth } from "../AuthContext";
import { ME_URL } from "../../assets/urls/djangoUrls";

export default function LeaveTeamButton({ onLeave }) {
    const { user } = useAuth();

    const handleLeave = async () => {
        if (!user) {
            alert("You must be logged in.");
            return;
        }

        try {
            await axios.delete(ME_URL, { withCredentials: true });
            onLeave();
        } catch (error) {
            console.error("Error leaving team:", error);
            alert("Failed to leave the team.");
        }
    };

    return (
        <button className="competition-button" onClick={handleLeave}>
            Leave Team
        </button>
    );
}
