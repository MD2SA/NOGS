import { useNavigate } from "react-router-dom";
import JoinCompetitionButton from "../atoms/JoinCompetitionButton";

export default function CompetitionDetail({ data }) {

    const navigate = useNavigate();

    return (
        <div className="competition-info-container">
            <div>Required trophies: {data.league} <span className="emoji">🏆</span></div>
            <div>Mode: {data.time_seconds} s</div>
            <div>Lotation: {data.participants.length}/{data.capacity} shamers</div>
            <JoinCompetitionButton
                competitionId={data.id}
                OnJoinSuccess={() => navigate('/competitions/competition/', { state: { id: data.id } })} />
        </div>
    );
}
