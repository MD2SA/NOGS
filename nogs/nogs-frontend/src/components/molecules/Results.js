import ResultAtom from "../atoms/ResultAtom";
import Tooltip from "../atoms/Tooltip";


/**
 * @param gameInfo : { accuracy: float, timeUsed: int, wpm: int, raw: int }
 */
export default function Results({ gameInfo, handleLeave }) {

    return (
        <div className="resultsContainer smaller-container">
            <div className="resultAtomsContainer">
                <Tooltip text="WPM: correct characters divided by time.">
                    <ResultAtom label="WPM" value={gameInfo.wpm} />
                </Tooltip>
                <Tooltip text="Accuracy: percentage of correct characters.">
                    <ResultAtom label="Accuracy" value={gameInfo.accuracy + '%'} />
                </Tooltip>
                <Tooltip text="Raw: all characters (correct, incorrect, extra) per time.">
                    <ResultAtom label="Raw" value={gameInfo.raw} />
                </Tooltip>
                <Tooltip text="Time: total duration of the test.">
                    <ResultAtom label="Time" value={gameInfo.timeUsed + ' s'} />
                </Tooltip>
            </div>
            <div className="resultsDivider" />
            <button className="resultsButton" onClick={handleLeave}>
                Leave
            </button>
        </div>
    );
}

