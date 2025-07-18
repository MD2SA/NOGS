import { useEffect, useState } from "react";
import { TEAMS_URL } from "../../assets/urls/djangoUrls";
import { useAuth } from "../AuthContext";
import CreateTeamButton from "../atoms/CreateTeamButton";
import TeamDetail from "../molecules/TeamDetail";

export default function TeamComposer({ handleJoin }) {
    const { api, user } = useAuth();
    const [teams, setTeams] = useState([]);
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        api.get(TEAMS_URL)
            .then((response) => {
                setTeams(response.data);
                if (response.data.length === 0) setMessage("No teams available");
                else setMessage("");
            })
            .catch(() => setMessage("Failed to load teams"));
    }, []);

    return (
        <div className="composer-container">
            <h1 className="title">AVAILABLE TEAMS</h1>
            {user && <CreateTeamButton handleJoin={handleJoin} />}
            <div className="composer-grid">
                {teams.length ? (
                    teams.map((team, index) => (
                        <TeamDetail key={index} data={team} handleJoin={handleJoin} />
                    ))
                ) : (
                    <h2 className="sub-title">{message}</h2>
                )}
            </div>
        </div>
    );
}
