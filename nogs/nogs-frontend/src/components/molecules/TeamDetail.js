import { TEAM_JOIN_URL } from "../../assets/urls/djangoUrls";
import JoinButton from "../atoms/JoinButton";
import { DateTime } from "luxon";

export default function TeamDetail({ data, handleJoin }) {
    return (
        <div className="competition-card">
            <div className="competition-header">
                <h3>{data.name}</h3>
            </div>
            <div className="competition-details-grid">
                <div className="detail-row">
                    <span className="detail-label">Lotation:</span>
                    <span className="detail-value"> {data.members.length} shamers</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value"> {data.description}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Created at:</span>
                    <span className="detail-value"> {DateTime.fromISO(data.created_at).toLocaleString(DateTime.DATE_MED)}</span>
                </div>
            </div>

            <div className="competition-actions">
                <JoinButton
                    joinURL={TEAM_JOIN_URL}
                    id={data.id}
                    onJoinSuccess={() => handleJoin(data)}
                />
            </div>
        </div>
    );
}

