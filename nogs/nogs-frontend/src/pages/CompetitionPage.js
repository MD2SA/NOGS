import { useState } from "react";
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

    return (
        <div>
            {
                !displayGame ?
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
                        <Game setDisplayGame={setDisplayGame} isCompetition={true} />
                    </div>
            }
        </div >
    );
}
