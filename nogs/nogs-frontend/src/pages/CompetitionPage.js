import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { COMPETITION_PARTICIPANTS_URL } from "../assets/urls/djangoUrls";
import Test from "../components/atoms/Test";
import Results from "../components/molecules/Results";
import "../css/Competition.css";
import CompetitionTable from "../components/molecules/CompetitionTable";
import { useAuth } from "../components/AuthContext";


export default function CompetitionPage() {

    const { data } = useLocation()?.state || {};
    const { user } = useAuth();

    const [tries, setTries] = useState();
    const [participantData, setParticipantData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [displayGame, setDisplayGame] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [isValidTry, setIsValidTry] = useState(true);

    const [gameInfo, setGameInfo] = useState({
        accuracy: 0.0,
        timeUsed: 0,
        wpm: 0,
        raw: 0,
    });


    const getParticipantData = () => {
        setIsLoading(true);
        axios.get(COMPETITION_PARTICIPANTS_URL(data.id))
            .then(response => {
                const participant = response.data.find(p => p.user_id === (user?.id || null))
                if (participant)
                    setTries(participant.tries_left);
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


    const handleStart = () => {
        axios.put(COMPETITION_PARTICIPANTS_URL(data.id), { gameInfo }, { withCredentials: true })
            .then(response => {
                setTries(response.data.tries_left);
                isValidTry(true);
            })
            .catch(error => {
                setIsValidTry(false);
            });
    }

    const handleFinish = (data) => {
        if (!isValidTry) {
            handleLeave();
            return;
        }
        setGameInfo({
            accuracy: data.accuracy,
            timeUsed: data.timeUsed,
            raw: data.raw,
            wpm: data.wpm,
        });
        setShowResult(true);
    }
    const handleLeave = () => {
        setDisplayGame(false);
        setShowResult(false);
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
                <div>
                    {!showResult ? (
                        <Test targetText={data.phrase} handleStart={handleStart} handleFinish={handleFinish} />
                    ) : (
                        <Results gameInfo={gameInfo} handleLeave={handleLeave} />
                    )}
                </div>
            )}
        </div>
    );
}
