import axios from "axios";
import { useEffect, useState } from "react";
import Test from "../atoms/Test";
import GameControls from "./GameControls";

export default function Game() {

    const [gameControls, setGameControls] = useState({
        mode: 'words',
        time: null,
        wordCount: 10,
    });
    const [test, setTest] = useState("The quick brown fox jumps over the lazy dog.");


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
        });;
    };

    useEffect(() => {
        loadTest();
    }, [gameControls.mode,gameControls.time,gameControls.wordCount]);

    const [gameInfo, setGameInfo] = useState({
        wpm: 0,
        accuracy: 0.0,
        timeUsed: 0,
    });

    return (
        <div>
            <GameControls gameControls={gameControls} setGameControls={setGameControls} />
            <Test targetText={test} setGameInfo={setGameInfo} />
        </div>
    );
}
