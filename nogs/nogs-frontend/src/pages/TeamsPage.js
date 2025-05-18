import { useEffect, useState } from "react";
import "../css/Competition.css";
import {
    TEAM_LEAVE_URL,
    MY_TEAM_URL,
} from "../assets/urls/djangoUrls";

import Team from "../components/organisms/Team";
import TeamComposer from "../components/organisms/TeamComposer";
import { useAuth } from "../components/AuthContext";

export default function TeamsPage() {
    const { api } = useAuth();
    const [myTeam, setMyTeam] = useState(null);

    // Verifica se o utilizador já está numa equipa ao entrar na página
    useEffect(() => {
        fetchMyTeam();
    }, []);

    // Buscar equipa atual do utilizador
    const fetchMyTeam = async () => {
        try {
            const response = await api.get(MY_TEAM_URL);
            setMyTeam(response.data);
        } catch (error) {
            if (error.response?.status === 404) {
                setMyTeam(null);
            } else {
                console.error("Erro ao verificar equipa:", error);
            }
        }
    };

    // Sair da equipa
    const handleLeaveTeam = async () => {
        try {
            await api.delete(TEAM_LEAVE_URL);
            setMyTeam(null);
        } catch (error) {
            console.error("Erro ao sair da equipa:", error);
        }
    };

    return (
        <>
            {myTeam ? (
                <Team team={myTeam} onLeave={handleLeaveTeam} update={fetchMyTeam} />
            ) : (
                <TeamComposer handleJoin={fetchMyTeam} />
            )}
        </>
    );
}
