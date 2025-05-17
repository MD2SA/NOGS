import "../../css/Competition.css";
import TeamTable from "../molecules/TeamTable";
import TeamChat from "../molecules/TeamChat";
import ConfirmationModal from "../atoms/ConfirmationModal";
import { useState } from "react";

export default function Team({ team, onLeave, update }) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <h1 className="title">{team.name}</h1>
            <div className="competition-container"
                style={{
                    alignItems: "flex-start",
                }}
            >
                <div className="sub-container">
                    <h3 className="sub-title">Members</h3>
                    {team.members && team.members.length > 0 ? (
                        <TeamTable data={team.members} update={update} />
                    ) : (
                        <p>No members yet.</p>
                    )}
                </div>
                <div className="resultsDivider" />
                <div className="sub-container">
                    <h3 className="sub-title">Chat</h3>
                    <TeamChat teamId={team.id} />
                </div>
            </div>
            <button onClick={() => setIsOpen(true)}>Leave Team</button>
            <ConfirmationModal isOpen={isOpen} close={() => setIsOpen(false)} title={"Leave"} message={"leave team"} onConfirmation={onLeave} />
        </div>
    );
}
