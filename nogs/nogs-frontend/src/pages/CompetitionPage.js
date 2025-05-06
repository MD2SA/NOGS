import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { COMPETITION_PARTICIPANTS_URL, COMPETITION_URL } from "../assets/urls/djangoUrls";
import Test from "../components/atoms/Test";
import Results from "../components/molecules/Results";
import Table from "../components/molecules/Table";
import "../css/Competition.css";


export default function CompetitionPage() {

    const { data } = useLocation()?.state || {};
    console.log("DATA", data);

    const [displayGame, setDisplayGame] = useState(false);
    const [showResult, setShowResult] = useState(false);

    //axios info
    const [tries, setTries] = useState(); // ir buscar isto ao axios
    const [test, setTest] = useState(data.phrase); //ir buscar isto ao acxio

    const loadCompetition = () => {
    }

    useEffect(() => {
        loadCompetition();
    }, []);



    const handleStart = () => {
        axios.put(COMPETITION_PARTICIPANTS_URL(data.id), { gameInfo }, { withCredentials: true })
            .then(response => {
                setTries(response.data.tries_left);
            })
            .catch(error => {
                console.log(error);
            });
        setTries(tries - 1);
    }

    const handleFinish = (data) => {
        setGameInfo({
            accuracy: data.accuracy,
            timeUsed: data.timeUsed,
            raw: data.raw,
            wpm: data.wpm,
        });
        setShowResult(true);
        //EM VEZ DISTO METO DIRETAMETNE NO SERVER
        /*
         * PUT IN AXIOS DJNAGO HERE
         *
         */
    }
    const handleLeave = () => {
        setDisplayGame(false);
        setShowResult(false);
    }

    const info = Array.from({ length: 30 }, (_, i) => ({
        "#": i + 1,
        name: `User ${i + 1}`,
        wpm: (Math.random() * 300).toFixed(0),
        acc: `${(Math.random() * 100).toFixed(2)}%`,
    }));

    const [gameInfo, setGameInfo] = useState({
        accuracy: 0.0,
        timeUsed: 0,
        wpm: 0,
        raw: 0,
    });
    return (
        <div>
            <h1 className="title">TIME TO LOCK IN</h1>
            {!displayGame ? (
                <div>
                    <div className="competition-container">
                        <div className="sub-container">
                            <h3 className="sub-title">LeaderBoard</h3>
                            <Table data={info} />
                        </div>
                        <div className="resultsDivider" />
                        <div className="sub-container">
                            <h3 className="sub-title">Tries left: {tries}</h3>
                            <button className="resultsButton" onClick={() => setDisplayGame(true)}>
                                Play
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    {!showResult ? (
                        <Test targetText={data.phrase} time={data.time_seconds} handleStart={handleStart} handleFinish={handleFinish} />
                    ) : (
                        <Results gameInfo={gameInfo} handleLeave={handleLeave} />
                    )}
                </div>
            )}
        </div>
    );
}
