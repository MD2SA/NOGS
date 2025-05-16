import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Test from "../atoms/Test";
import Results from "../molecules/Results";
import GameControls from "../molecules/GameControls";
import { GENERATE_GAME_URL } from "../../assets/urls/djangoUrls";
import { useAuth } from "../AuthContext";

export default function Game({
    isCompetition = false,
    SubmissionURL,
    targetText,
    onStartTest,
    onFinishTest,
    onLeave,
}) {
    const location = useLocation();
    const { api } = useAuth();
    const [showResult, setShowResult] = useState(false);
    const [wordCount, setWordCount] = useState(10);
    const [lastRefresh, setLastRefresh] = useState(-1);
    const [curPhrase, setCurPhrase] = useState(targetText);
    const [gameInfo, setGameInfo] = useState(); //accuracy, timeUsed, raw, wpm,


    const fetchNewTest = () => {
        axios.get(GENERATE_GAME_URL, { params: { word_count: wordCount, } })
            .then((response) => {
                setCurPhrase(response.data.phrase);
            }).catch((error) => {
                console.error("There was an error loading the test:", error);
            });
    }

    const restartTest = () => {
        if (!isCompetition) {
            fetchNewTest();
            setShowResult(false);
        }
    };

    const handleFinish = (data) => {
        if (onFinishTest) onFinishTest();
        handleSubmit(data);
        setGameInfo({
            accuracy: data.accuracy,
            timeUsed: data.timeUsed,
            raw: data.raw,
            wpm: data.wpm,
        });
        setShowResult(true);
    };

    const handleLeave = () => {
        if (onLeave) onLeave();
        setShowResult(false);
        if (!isCompetition)
            fetchNewTest();
    }

    const handleSubmit = (data) => {
        const serverData = { ...data, time_used: data.timeUsed }
        delete serverData.timeUsed;

        api.post(SubmissionURL, serverData)
            .then(response => console.log("Submitted:", response))
            .catch(error => console.error("Submit error:", error));
    }

    useEffect(() => {
        if (!isCompetition && location.state?.refresh !== lastRefresh || showResult === false) {
            if (!isCompetition)
                fetchNewTest();
            setShowResult(false);
            setLastRefresh(location.state?.refresh);
        }
    }, [showResult, location.state, wordCount]);


    return (
        <div>
            {!showResult ? (
                <>
                    {!isCompetition && <GameControls wordCount={wordCount} setWordCount={setWordCount} />}
                    <Test
                        targetText={isCompetition ? targetText : curPhrase}
                        handleStart={onStartTest}
                        handleFinish={handleFinish}
                    />
                    {!isCompetition && <button onClick={restartTest}>Restart</button>}

                </>
            ) : (
                <Results gameInfo={gameInfo} handleLeave={handleLeave} />
            )}
        </div>
    );
}

