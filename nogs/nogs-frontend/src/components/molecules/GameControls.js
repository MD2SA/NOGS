import OptionSelector from "../atoms/OptionSelector";
import "../../css/GameControls.css";

/**
 * @param gameControls: { mode: 'words'|'time', time:null|int, wordCount:null|int}
 *
 */
export default function GameControls({ wordCount, setWordCount }) {

    const wordOptions = [10, 25, 50, 100];

    return (
        <div className="game-controls">
            <button
                className="control-label active"
                tabIndex={-1} // se nao quiser que a tab ande de uma lado para outro
            >
                words
            </button>
            <div className="divider" />
            <OptionSelector
                options={wordOptions}
                selectedOption={wordCount}
                setSelectedOption={(option)=>setWordCount(option)}
            />
        </div>
    );
}
