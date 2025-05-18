import { useState } from "react";
import CreateTeamModal from "./CreateTeamModal";

export default function CreateTeamButton({handleJoin}) {
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
                    <CreateTeamModal isOpen={isModalOpen} onClose={handleCloseModal}/>
                </>
            )}
        </>
    );
}
