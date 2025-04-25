import axios from "axios";
import { useState } from "react";
import MonkeyTypeEffect from "../atoms/Type";
import GameControls from "./GameControls";

export default function Game() {

    const [gameControls,setGameControls] = useState({
        mode:'words',
        time:null,
        wordCount:10,
    });

    const phrase = "The quick brown fox jumps over the lazy dog."

    return(
        <>
            <GameControls gameControls={gameControls} setGameControls={setGameControls}/>
            <MonkeyTypeEffect phrase={phrase}/>
        </>
    );
}
