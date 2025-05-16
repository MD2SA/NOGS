import JoinCompetitionButton from "../atoms/JoinCompetitionButton";
import { DateTime } from "luxon";

export default function CompetitionDetail({ data, setShownCompetition }) {

    return (
        <div className="competition-card">
            <div className="competition-header">
                <h3>Competition Details</h3>
            </div>

            <div className="competition-details-grid">
                <div className="detail-row">
                    <span className="detail-label">Mode:</span>
                    <span className="detail-value">{data.word_count} words</span>
                </div>

                <div className="detail-row">
                    <span className="detail-label">Ends:</span>
                    <span className="detail-value">
                        {DateTime.fromISO(data.end_of_event).toLocaleString(DateTime.DATETIME_MED)}
                    </span>
                </div>

                <div className="detail-row">
                    <span className="detail-label">Max tries:</span>
                    <span className="detail-value">{data.max_tries || "Unlimited"}</span>
                </div>

                <div className="detail-row">
                    <span className="detail-label">Participants:</span>
                    <span className="detail-value">{data.participants.length}/{data.capacity}</span>
                </div>
            </div>

            <div className="competition-actions">
                <JoinCompetitionButton
                    competitionId={data.id}
                    OnJoinSuccess={() => setShownCompetition(data)}
                />
            </div>
        </div>
    );
}
