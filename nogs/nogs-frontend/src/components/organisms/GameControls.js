import { useState } from "react";
import ModeSelector from "../molecules/ModeSelector";
import OptionSelector from "../molecules/OptionSelector";

import "../../css/GameControls.css";

/**
 * @param gameControls: { mode: 'words'|'time', time:null|int, wordCount:null|int}
 *
 */
export default function GameControls({ gameControls, setGameControls }) {

    const wordOptions = [10, 25, 50, 100];
    const timeOptions = [15, 30, 60, 120];

    const options = gameControls.mode === "words" ? wordOptions : timeOptions;


    const setMode = (newMode) => {
        if (newMode !== 'words' && newMode !== 'time') return;
        if (newMode !== gameControls.mode) setOption(gameControls.mode === "words" ? timeOptions : wordOptions)
        setGameControls(prevData => ({
            ...prevData,
            mode: newMode,
            // Set default value when switching modes
            ...(newMode === 'words'
                ? { time: null, wordCount: wordOptions[0] }
                : { wordCount: null, time: timeOptions[0] }
            )
        }));
    }

    const setOption = (option) => {
        setGameControls(prevData => ({
            ...prevData,
            ...(gameControls.mode === 'words' ? { wordCount: option } : { time: option })
        }));
    }

    return (
        <div className="game-controls">
            <ModeSelector mode={gameControls.mode} setMode={setMode} />
            <div className="divider" />
            <OptionSelector
                options={options}
                selectedOption={gameControls.mode === 'words' ? gameControls.wordCount : gameControls.time}
                setSelectedOption={setOption}
            />
        </div>
    );
}
