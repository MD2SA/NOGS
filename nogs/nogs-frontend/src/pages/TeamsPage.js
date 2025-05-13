import { useEffect, useState } from "react";

import "../css/Competition.css";
import {
  TEAMS_URL,
  TEAM_LEAVE_URL,
  TEAM_JOIN_URL,
  MY_TEAM_URL,
} from "../assets/urls/djangoUrls";

import Team from "../components/organisms/Team";
import TeamComposer from "../components/organisms/TeamComposer";
import CreateTeam from "../components/atoms/CreateTeam";
import {useAuth} from "../components/AuthContext";

export default function TeamsPage() {
  const { api, user } = useAuth();
  const [myTeam, setMyTeam] = useState(null);
  const [teams, setTeams] = useState([]);

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
        fetchTeams();
      } else {
        console.error("Erro ao verificar equipa:", error);
      }
    }
  };

  // Buscar todas as equipas (caso não esteja em nenhuma)
  const fetchTeams = async () => {
    try {
      const response = await api.get(TEAMS_URL);
      setTeams(response.data);
    } catch (error) {
      console.error("Erro ao carregar equipas:", error);
    }
  };

  // Sair da equipa
  const handleLeaveTeam = async () => {
    try {
      await api.delete(TEAM_LEAVE_URL);
      setMyTeam(null);
      fetchTeams(); // volta a mostrar lista
    } catch (error) {
      console.error("Erro ao sair da equipa:", error);
    }
  };

  // Quando se junta a uma equipa, atualiza a vista
  const handleJoinSuccess = (team) => {
    fetchMyTeam(team);
  };

  return (
    <div className="competitions-container">
      {myTeam ? (
        <Team team={myTeam} onLeave={handleLeaveTeam} />
      ) : (
        <>
          <TeamComposer data={teams} setShownTeam={handleJoinSuccess} />

        </>
      )}
    </div>
  );
}
