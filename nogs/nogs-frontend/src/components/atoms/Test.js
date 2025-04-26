import { useState, useEffect } from "react";
import "../../css/Test.css";

export default function Test({ targetText, setGameInfo }) {
    const targetWords = targetText.split(" ");
    const [typedWord, setTypedWord] = useState("");
    const [curWord, setCurWord] = useState(0);


    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Backspace") {
                setTypedWord((prev) => prev.slice(0, -1));
            } else if (e.key.length === 1) {
                if( e.key === " " && curWord !== "") {
                    setTypedWord("");
                    setCurWord(curWord+1);
                } else if( e.key !== " ") {
                    setTypedWord((prev) => prev + e.key);
                }
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);


    const renderWord = (targetWord, wordIndex) => {
        const letters = [];

        const maxLen = Math.max(targetWord.length, typedWord.length);

        for (let i = 0; i < maxLen; i++) {
            const expected = targetWord[i];
            const actual = typedWord[i];

            let className = "pending";
            if (actual === undefined) {
                className = "pending";
            } else if (actual === expected) {
                className = "correct";
            } else {
                className = "incorrect";
            }

            letters.push(
                <span key={i} className={`${className}`}>
                    {actual || expected}
                </span>
            );
        }

        return (
            <div key={wordIndex} className="word">
                {letters}
            </div>
        );
    };

    return (
        <div className="container">
            <div className="text-container">
                {targetWords.map((word, index) => renderWord(word, index))}
            </div>
        </div>
    );
}

