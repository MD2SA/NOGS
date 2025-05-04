import { useNavigate } from "react-router-dom";

export default function Competition({ data }) {

    const navigate = useNavigate();

    return (
        <div className="competition-info-container">
            <div>Required trophies: {data.league} <span className="emoji">🏆</span></div>
            <div>Mode: {data.modeOption} {data.mode}</div>
            <div>Lotation: {data.occupied}/{data.lotation} shamers</div>
            <button
                className="competition-button"
                onClick={() => navigate('/competitions/competition/', { state: { id: data.id } })}
            >Join</button>
        </div>
    );
}
