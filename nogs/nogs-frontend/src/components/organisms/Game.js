import axios from "axios";
import { useEffect, useState } from "react";
import { GENERATE_GAME_URL, SUBMIT_RESULT_URL } from "../../assets/urls/djangoUrls";
import Test from "../atoms/Test";
import Results from "../molecules/Results";
import GameControls from "../molecules/GameControls";
import { useLocation } from "react-router-dom";

export default function Game({ isCompetition = false, setDisplayGame = () => { } }) {

    const location = useLocation();

    const [gameControls, setGameControls] = useState({
        mode: 'words',
        time: null,
        wordCount: 10,
    });
    const [test, setTest] = useState("The quick brown fox jumps over the lazy dog.");
    const [gameInfo, setGameInfo] = useState({
        accuracy: 0.0,
        timeUsed: 0,
        wpm: 0,
        raw: 0,
    });
    const [showResult, setShowResult] = useState(false);

    const loadTest = () => {
        axios.get(GENERATE_GAME_URL, {
            params: {
                mode: gameControls.mode,
                time_seconds: gameControls.time,
                word_count: gameControls.wordCount,
            }
        }).then((response) => {
            setTest(response.data.test);
        }).catch((error) => {
            console.error("There was an error loading the test:", error);
        });
    };

    const submitTest = () => {

        axios.put(SUBMIT_RESULT_URL, {
            params: {
                accuracy: gameInfo.accuracy,
                time_used: gameInfo.timeUsed,
                raw: gameInfo.raw,
                wpm: gameInfo.wpm,
            }
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error("There was an error loading the test:", error);
        });
    }

    const [lastRefresh, setLastRefresh] = useState(-1);

    useEffect(() => {
        if (location.state?.refresh !== lastRefresh) {
            setShowResult(false);
            loadTest();
            setLastRefresh(location.state?.refresh);
        } else if (showResult === false)
            loadTest();
        else
            submitTest();
    }, [gameControls, showResult, location.state]);

    return (
        <div>
            {!showResult ?
                <>
                    <GameControls gameControls={gameControls} setGameControls={setGameControls} />
                    <Test targetText={test} setGameInfo={setGameInfo} setShowResult={setShowResult} />
                    <button
                        onClick={loadTest}
                    >
                        Restart
                    </button> : null
                </>
                : <Results gameInfo={gameInfo} setShowResult={setShowResult} />
            }
        </div >
    );
}
