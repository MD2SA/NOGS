import { useState } from "react";
import Test from "../components/atoms/Test";
import Results from "../components/molecules/Results";
import Table from "../components/molecules/Table";
import Game from "../components/organisms/Game";
import "../css/Competition.css";


export default function CompetitionPage() {

    const [tries, setTries] = useState(3);
    const [displayGame, setDisplayGame] = useState(false);

    const compete = () => {
        if (tries <= 0) {
            return;
        }
        setDisplayGame(true);
        setTries(tries - 1);
    }

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

    return (
        <div>
            {!displayGame ?
                <div>
                    < h1 className="title" > TIME TO LOCK IN</h1 >
                    <div className="competition-container">
                        <Table />
                        <div className="resultsDivider" />
                        <div className="sub-container">
                            <h3 className="sub-title">
                                Tries left : {tries}
                            </h3>
                            <button className="resultsButton" onClick={() => compete()} >
                                Play
                            </button>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <h3 className="sub-title">
                        Tries left : {tries}
                    </h3>
                    {!showResult ?
                        <Test targetText={test} setGameInfo={setGameInfo} setShowResult={setShowResult} />
                        :
                        <Results gameInfo={gameInfo} setShowResult={setShowResult} />
                    }
                </div>
            }
        </div >
    );
}
