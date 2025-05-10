import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TEAM_DETAIL_URL } from "../assets/urls/djangoUrls";
import TeamTable from "../components/molecules/TeamTable";
import LeaveTeamButton from "../components/atoms/LeaveTeamButton";
import "../css/Competition.css";

export default function TeamPage() {
    const { state } = useLocation();
    const team = state?.data;
    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const getTeamMembers = () => {
        axios.get(TEAM_DETAIL_URL(team.id))
            .then(response => {
                setMembers(response.data.members);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        getTeamMembers();
    }, []);

    return (
        <div>
            <h1 className="title">TEAM: {team.name}</h1>
            <p className="sub-title">{team.description}</p>
            <LeaveTeamButton onLeave={() => navigate("/teams")} />

            <h2 className="sub-title">Members:</h2>
            {loading ? (
                <p>Loading team members...</p>
            ) : (
                <TeamTable data={members} />
            )}
        </div>
    );
}
