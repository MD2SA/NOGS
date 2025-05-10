import { useNavigate } from "react-router-dom";
import JoinCompetitionButton from "../atoms/JoinCompetitionButton";

export default function CompetitionDetail({ data }) {

    const navigate = useNavigate();

    return (
        <div className="competition-info-container">
            <div className="competition-detail">
                <span>Mode:  {data.word_count} words</span>
            </div>
            <div className="competition-detail">
                <span>Lotation: {/*data.participants.length*/}/{data.capacity} shamers</span>
            </div>
            <JoinCompetitionButton
                competitionId={data.id}
                OnJoinSuccess={() => navigate('/competitions/competition/', { state: { data: data } })} />
        </div>
    );
}
