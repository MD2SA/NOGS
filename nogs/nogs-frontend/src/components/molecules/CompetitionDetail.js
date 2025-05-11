import JoinCompetitionButton from "../atoms/JoinCompetitionButton";
import { DateTime } from "luxon";

export default function CompetitionDetail({ data, setShownCompetition }) {

    return (
        <div className="competition-info-container">
            <div className="competition-detail">
                <span>Mode:  {data.word_count} words</span>
            </div>
            <div className="competition-detail">
                <span>End of event:  {DateTime.fromISO(data.end_of_event).toLocaleString(DateTime.DATETIME_MED)}</span>
            </div>
            <div className="competition-detail">
                <span>Max tries:  {data.max_tries || "unlimited"}</span>
            </div>
            <div className="competition-detail">
                <span>Lotation: {data.participants.length}/{data.capacity} shamers</span>
            </div>
            <JoinCompetitionButton
                competitionId={data.id}
                OnJoinSuccess={() => setShownCompetition(data)}
            />
        </div>
    );
}
