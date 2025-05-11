import { useEffect, useState } from "react";
import { TEAMS_URL } from "../assets/urls/djangoUrls";
import TeamDetail from "../components/molecules/TeamDetail";
import "../css/Competition.css";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import CreateTeam from "../components/atoms/CreateTeam";

export default function TeamsPage() {
    const [teams, setTeams] = useState();
    const [message, setMessage] = useState('');

    const loadTeams = () => {
        axios.get(TEAMS_URL)
            .then(response => {
                setTeams(response.data);
            })
            .catch(error => setMessage("No teams available"));
    };

    useEffect(() => {
        setMessage("Loading...");
        loadTeams();
    }, []);

    const { user } = useAuth();

    return (
        <div className="competitions-container">
            <h1 className="title">AVAILABLE TEAMS:</h1>
            {user && <CreateTeam />}
            <div className="competition-grid">
                {(teams?.length) ? (
                    teams.map((data, index) => (
                        <TeamDetail key={`team-${index}`} data={data} />
                    ))
                ) : (
                    <h2 className="sub-title">{message}</h2>
                )}
            </div>
        </div>
    );
}
