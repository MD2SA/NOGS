import { useNavigate } from "react-router-dom";
import JoinTeamButton from "../atoms/JoinTeamButton";

export default function TeamDetail({ data }) {
    const navigate = useNavigate();

    return (
        <div className="competition-info-container">
            <div className="competition-detail">
                <span><strong>Team Name:</strong> {data.name}</span>
            </div>
            <div className="competition-detail">
                <span><strong>Description:</strong> {data.description}</span>
            </div>
            <JoinTeamButton
                teamId={data.id}
                onJoinSuccess={() => navigate('/teams/team/', { state: { data: data } })}
            />
        </div>
    );
}
