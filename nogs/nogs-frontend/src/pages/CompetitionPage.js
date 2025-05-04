import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Test from "../components/atoms/Test";
import Results from "../components/molecules/Results";
import Table from "../components/molecules/Table";
import "../css/Competition.css";


export default function CompetitionPage() {

    const location = useLocation();

    const { id } = location?.state || {};

    const [displayGame, setDisplayGame] = useState(false);
    const [showResult, setShowResult] = useState(false);

    //axios info
    const [tries, setTries] = useState(3); // ir buscar isto ao axios
    const [test, setTest] = useState("today is the day im going to go to school for the first time in a long time"); //ir buscar isto ao acxio

    const COMPETITION_URL = "meter aqui url"
    const loadCompetition = () => {
        axios.get(COMPETITION_URL + "/" + id);
    }

    const [gameControls, setGameControls] = useState({
        mode: 'words',
        time: null,
        wordCount: 10,
    });

    const [gameInfo, setGameInfo] = useState({
        accuracy: 0.0,
        timeUsed: 0,
        wpm: 0,
        raw: 0,
    });


    const handleStart = () => {
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

    const data = Array.from({ length: 30 }, (_, i) => ({
        "#": i + 1,
        name: `User ${i + 1}`,
        wpm: (Math.random() * 300).toFixed(0),
        acc: `${(Math.random() * 100).toFixed(2)}%`,
    }));

    return (
        <div>
            < h1 className="title" > TIME TO LOCK IN</h1 >
            {!displayGame ?
                <div>
                    <div className="competition-container">
                        <div className="sub-container">
                            <h3 className="sub-title">LeaderBoard</h3>
                            <Table data={data} />
                        </div>
                        <div className="resultsDivider" />
                        <div className="sub-container">
                            <h3 className="sub-title">
                                Tries left : {tries}
                            </h3>
                            <button className="resultsButton" onClick={() => setDisplayGame(true)} >
                                Play
                            </button>
                        </div>
                    </div>
                </div>
                :
                <div>
                    {!showResult ?
                        <Test targetText={test} time={gameControls.time} handleStart={handleStart} handleFinish={handleFinish} />
                        :
                        <Results gameInfo={gameInfo} handleLeave={handleLeave} />
                    }
                </div>
            }
        </div >
    );
}
