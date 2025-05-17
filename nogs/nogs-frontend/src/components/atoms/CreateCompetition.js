import { useState, useEffect } from "react";
import CompetitionModal from "./CompetitionModal";
import { ME_URL } from "../../assets/urls/djangoUrls";
import "../../css/CreateCompetition.css"
import { useAuth } from "../AuthContext";

export default function CreateCompetition({ onCreate }) {

    const { api } = useAuth();

    const [isStaff, setIsStaff] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const askPermissions = async () => {
            try {
                const response = await api.get(ME_URL);
                setIsStaff(response?.data?.is_staff || false);
            } catch (error) {
                setIsStaff(false);
            }
        };
        askPermissions();
    }, []);


    return (
        <>
            {(isStaff || true) && (
                <>
                    <button
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create Competition
                    </button>
                    <CompetitionModal isOpen={isModalOpen} onCreate={onCreate} onClose={() => setIsModalOpen(false)} />
                </>
            )}
        </>
    );
}
