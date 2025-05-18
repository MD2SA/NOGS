import { useState, useEffect } from "react";
import CreateCompetitionModal from "./CreateCompetitionModal";
import { ME_URL } from "../../assets/urls/djangoUrls";
import { useAuth } from "../AuthContext";

export default function CreateCompetitionButton({ onCreate }) {

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
                    <CreateCompetitionModal isOpen={isModalOpen} onCreate={onCreate} onClose={() => setIsModalOpen(false)} />
                </>
            )}
        </>
    );
}
