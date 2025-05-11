import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { COMPETITION_PARTICIPANTS_URL, COMPETITION_SUBMIT_URL, COMPETITION_TRY_URL } from "../assets/urls/djangoUrls";
import Test from "../components/atoms/Test";
import Results from "../components/molecules/Results";
import "../css/Competition.css";
import CompetitionTable from "../components/molecules/CompetitionTable";
import { useAuth } from "../components/AuthContext";
import Game from "../components/organisms/Game";


export default function CompetitionPage() {

    const { data } = useLocation()?.state || {};
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
                console.log(response);
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
                    <div className="competition-container">
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
                            <h3 className="sub-title">Tries left: {tries}</h3>
                            <button className="resultsButton" onClick={() => setDisplayGame(tries > 0)}>
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
                    onLeave={() => {setDisplayGame(false);getParticipantData();}}
                />
            )}
        </div>
    );
}
// {
//     !showResult ? (
//         <Test targetText={data.phrase} handleStart={handleStart} handleFinish={handleFinish} />
//     ) : (
//     <Results gameInfo={gameInfo} handleLeave={handleLeave} />
// )
// }
