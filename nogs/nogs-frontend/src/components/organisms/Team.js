import "../../css/Competition.css";
import TeamTable from "../molecules/TeamTable";

export default function Team({ team, onLeave }) {
  return (
    <div>
      <h1 className="title">{team.name}</h1>
      <div className="competition-container">
        <div className="sub-container">
          <h3 className="sub-title">Team Members</h3>
          {team.members && team.members.length > 0 ? (
            <TeamTable data={team.members} />
          ) : (
            <p>No members yet.</p>
          )}
        </div>
        <div className="resultsDivider" />
      </div>
      <button onClick={onLeave} className="btn-leave">Leave Team</button>
    </div>
  );
}
