import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GENERATE_GAME_URL, SUBMIT_RESULT_URL } from "../assets/urls/djangoUrls";
import Test from "../components/atoms/Test";
import Results from "../components/molecules/Results";
import GameControls from "../components/molecules/GameControls";

export default function HomePage() {

    const location = useLocation();

    const [gameControls, setGameControls] = useState({
        wordCount: 10,
    });
    const [showResult, setShowResult] = useState(false);
    const [test, setTest] = useState("The quick brown fox jumps over the lazy dog.");
    const [gameInfo, setGameInfo] = useState({
        accuracy: 0.0,
        timeUsed: 0,
        wpm: 0,
        raw: 0,
    });
    const [lastRefresh, setLastRefresh] = useState(-1);

    const loadTest = () => {
        axios.get(GENERATE_GAME_URL, { params: { word_count: gameControls.wordCount, } })
            .then((response) => {
                setTest(response.data.phrase);
            }).catch((error) => {
                console.error("There was an error loading the test:", error);
            });
    };

    const submitTest = () => { }


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

    const handleFinish = (data) => {
        //meto logo no AXIOS
        setGameInfo({
            accuracy: data.accuracy,
            timeUsed: data.timeUsed,
            raw: data.raw,
            wpm: data.wpm,
        });
        setShowResult(true);
    }

    return (
        <div>
            {!showResult ?
                <>
                    <GameControls gameControls={gameControls} setGameControls={setGameControls} />
                    <Test targetText={test} time={gameControls.time} handleFinish={handleFinish} />
                    <button
                        onClick={loadTest}
                    >
                        Restart
                    </button>

                </>
                : <Results gameInfo={gameInfo} handleLeave={() => setShowResult(false)} />
            }
        </div>
    );
}
