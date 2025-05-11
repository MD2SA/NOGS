import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GENERATE_GAME_URL, SUBMIT_RESULT_URL } from "../assets/urls/djangoUrls";
import Test from "../components/atoms/Test";
import Results from "../components/molecules/Results";
import GameControls from "../components/molecules/GameControls";
import Game from "../components/organisms/Game";
import { useAuth } from "../components/AuthContext";

export default function HomePage() {

    const location = useLocation();
    const { api } = useAuth();

    const [wordCount, setWordCount] = useState(10);
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
        axios.get(GENERATE_GAME_URL, { params: { word_count: wordCount, } })
            .then((response) => {
                setTest(response.data.phrase);
            }).catch((error) => {
                console.error("There was an error loading the test:", error);
            });
    };

    useEffect(() => {
        if (location.state?.refresh !== lastRefresh) {
            setShowResult(false);
            loadTest();
            setLastRefresh(location.state?.refresh);
        } else if (showResult === false)
            loadTest();
    }, [wordCount, showResult, location.state]);


    return (
        <div>
            <Game
                isCompetition={false}
                targetText={test}
                gameInfo={gameInfo}
                setGameInfo={setGameInfo}
                SubmissionURL={SUBMIT_RESULT_URL}
                fetchNewTest={(wordCount) =>
                    api.get(GENERATE_GAME_URL, { params: { word_count: wordCount } })
                        .then(res => res.data.phrase)
                }
            />
        </div>
    );
}
