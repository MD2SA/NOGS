import axios from "axios";
import { useEffect, useState } from "react";
import Test from "../atoms/Test";
import Results from "../molecules/Results";
import GameControls from "./GameControls";

export default function Game() {

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
        axios.get("http://127.0.0.1:8000/type/api/", {
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

        axios.put("http://127.0.0.1:8000/type/api/", {
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
    }

    useEffect(() => {
        if (showResult === true)
            submitTest();
        else
            loadTest();
    }, [gameControls, showResult]);

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
                    </button>
                </>
                : <Results gameInfo={gameInfo} setShowResult={setShowResult} />
            }
        </div >
    );
}
