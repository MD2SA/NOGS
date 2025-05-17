import { useEffect, useState } from "react";
import { COMPETITION_PARTICIPANTS_URL, COMPETITION_SUBMIT_URL, COMPETITION_TRY_URL } from "../../assets/urls/djangoUrls";
import "../../css/Competition.css";
import CompetitionTable from "../molecules/CompetitionTable";
import { useAuth } from "../AuthContext";
import Game from "./Game";


export default function Competition({ data }) {

    const { api, user } = useAuth();

    const [tries, setTries] = useState();
    const [participantData, setParticipantData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [displayGame, setDisplayGame] = useState(false);
    const [isValidTry, setIsValidTry] = useState(true);


    const getParticipantData = () => {
        setIsLoading(true);
        api.get(COMPETITION_PARTICIPANTS_URL(data.id))
            .then(response => {
                const participant = response.data.find(p => p.user === (user?.id || -1))
                if (participant)
                    setTries(participant.tries);
                else
                    setTries(0);
                setParticipantData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        getParticipantData();
    }, []);


    const onStartTest = () => {
        api.post(COMPETITION_TRY_URL(data.id))
            .then(response => {
                setTries(response.data.tries);
                isValidTry(true);
            })
            .catch(error => {
                setIsValidTry(false);
            });
    }


    return (
        <div>
            <h1 className="title">TIME TO LOCK IN</h1>
            {!displayGame ? (
                <div>
                    <div className="resultsContainer smaller-container">
                        <div className="sub-container">
                            <h3 className="sub-title">LeaderBoard</h3>
                            {isLoading ? (
                                <h2 className="sub-title">Loading table...</h2>
                            ) : (
                                <CompetitionTable data={participantData} />
                            )}
                        </div>
                        <div className="resultsDivider" />
                        <div className="sub-container">
                            <h3 className="sub-title">Tries left: {tries !== null ? tries : "unlimited"}</h3>
                            <button className="resultsButton" onClick={() => setDisplayGame(tries > 0 || tries === null)}>
                                Play
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <Game
                    isCompetition={true}
                    SubmissionURL={COMPETITION_SUBMIT_URL(data.id)}
                    targetText={data.phrase}
                    onStartTest={onStartTest}
                    onLeave={() => { setDisplayGame(false); getParticipantData(); }}
                />
            )}
        </div>
    );
}
