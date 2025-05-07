import axios from "axios";
import { useEffect, useState } from "react";
import Test from "../atoms/Test";
import Results from "../molecules/Results";
import GameControls from "../molecules/GameControls";

export default function Game({ SubmissionURL, targetText, time, handleStart, handleFinish, handleLeave, gameInfo }) {

    const [showResult, setShowResult] = useState(false);

    const submitTest = () => {
        axios.put(SubmissionURL, { gameInfo })
            .then((response) => {
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
    }, [showResult, location.state]);

    return (
        <div>
            {!showResult ?
                <>
                    <GameControls gameControls={gameControls} setGameControls={setGameControls} />
                    <Test
                        targetText={targetText}
                        time={time}
                        handleStart={handleStart}
                        handleFinish={handleFinish}
                    />
                    <button
                        onClick={loadTest}
                    >
                        Restart
                    </button> : null
                </>
                : <Results gameInfo={gameInfo} handleLeave={handleLeave} />
            }
        </div >
    );
}
