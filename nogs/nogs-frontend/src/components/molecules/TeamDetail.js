import { TEAM_JOIN_URL } from "../../assets/urls/djangoUrls";
import JoinButton from "../atoms/JoinButton";

export default function TeamDetail({ data, setShownTeam }) {
    return (
        <div className="competition-card">
            <div className="competition-header">
                <h3>Team Details</h3>
            </div>
            <div className="competition-details-grid">
                <div className="detail-row">
                    <span className="detail-label">Team Name: </span>
                    <span className="detail-value">{data.name}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value"> {data.description}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Lotation:</span>
                    <span className="detail-value"> {data.members.length} shamers</span>
                </div>
            </div>

            <div className="competition-actions">
                <JoinButton
                    joinURL={TEAM_JOIN_URL}
                    id={data.id}
                    onJoinSuccess={() => setShownTeam(data)}
                />
            </div>
        </div>
    );
}

