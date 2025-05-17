import { useState } from "react";
import TeamModal from "./TeamModal";
import "../../css/CreateTeam.css";

export default function CreateTeam({handleJoin}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        handleJoin();
    };

    return (
        <>
            {(
                <>
                    <button
                        className="create-team-button"
                        onClick={handleClick}
                    >
                        Create Team
                    </button>
                    <TeamModal isOpen={isModalOpen} onClose={handleCloseModal}/>
                </>
            )}
        </>
    );
}
