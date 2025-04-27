import { useState, useEffect } from "react";
import "../../css/Test.css";

export default function Test({ targetText, setGameInfo }) {

    const targetWords = targetText.split(" ").map(word => {
        return word.split("").map(letter => ({
            letter: letter,
            className: "pending",
        }));
    });
    const [typedWords, setTypedWords] = useState(targetWords.map(() => ""));
    console.log(typedWords.length);
    const [cur, setCur] = useState(0);
    const [startTime, setStartTime] = useState(0);

    const isSameWord = (arrayLetters, word) => {
        if (!word || arrayLetters.length !== word.length) return false;
        for (let i = 0; i < arrayLetters.length; i++)
            if (arrayLetters[i].letter !== word[i]) return false;
        return true;
    }

    const getAccuracy = () => {
        let errors = 0;
        let sizeTarget = 0;
        for (const word of targetWords)
            for (const letter of word) {
                sizeTarget++;
                if (letter.className !== "correct")
                    errors++;
            }

        let sizeTyped = 0;
        for (const word of typedWords)
            for (const letter of word)
                sizeTyped++;

        errors += Math.max(sizeTyped - sizeTarget, 0);

        console.log("ERRORS", errors);
        console.log("sizeTarget", sizeTarget);
        return 1 - (errors / sizeTarget);
    }

    useEffect(() => {
        setTypedWords(targetWords.map(() => ""));
    }, [targetText]);
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Backspace") {
                if (typedWords[cur].length === 0 && cur > 0 && !isSameWord(targetWords[cur - 1], typedWords[cur - 1])) {
                    setCur(cur - 1);
                } else if (typedWords[cur].length > 0) {
                    if (e.ctrlKey || e.metaKey)
                        setTypedWords(prev => {
                            const updatedTypedWords = [...prev];
                            updatedTypedWords[cur] = "";
                            return updatedTypedWords;
                        });
                    else
                        setTypedWords(prev => {
                            const updatedTypedWords = [...prev];
                            updatedTypedWords[cur] = updatedTypedWords[cur].slice(0, -1);
                            return updatedTypedWords;
                        });
                }
            } else if (e.key === " ") {
                if (typedWords[cur].length > 0) {
                    if (cur + 1 >= typedWords.length) {
                        console.log("TESTE", targetWords);
                        console.log("TYPED", typedWords);
                        const accuracy = getAccuracy();
                        const timeUsed = (Date.now() - startTime) / 1000; // time in seconds
                        const raw = (targetText.length / 5) / timeUsed; // words per second
                        setGameInfo(() => {
                            return {
                                accuracy: accuracy,
                                timeUsed: timeUsed,
                                raw: raw * 60, // words per minute
                                wpm: raw * accuracy * 60, // WPM adjusted for accuracy
                            };
                        });
                    }
                    setCur(cur + 1);
                }
            } else if (e.key.length === 1) {
                if (startTime === 0) setStartTime(Date.now())
                setTypedWords(prev => {
                    const updatedTypedWords = [...prev]; //para renderizar novamente (===)
                    updatedTypedWords[cur] += e.key;
                    return updatedTypedWords;
                });
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [typedWords, cur]);

    const renderWord = (word, index) => {
        // Create a copy of the word array to avoid mutating the original

        const typedWord = typedWords[index] || "";
        if (index > cur) {
            word.forEach(letter => letter.className = "pending");
        } else {
            for (let i = 0; i < word.length; i++) {
                let name = "pending";
                if (i >= word.length)
                    name = "incorrect";
                else if (i < typedWord.length)
                    name = typedWord[i] === word[i].letter ? "correct" : "incorrect";
                else if (i === typedWord.length && cur === index)
                    name = "current";
                else if (i >= typedWord.length && cur > index)
                    name = "missing"


                word[i].className = name;
            }

            // if (typedWord.length > word.length) {
            //     const extraLetters = typedWord.slice(word.length).split("").map((letter, pos, array) => ({
            //         letter,
            //         className: (pos === array.length && index === cur) ? "current" : "incorrect",
            //     }));
            //     letters.push(...extraLetters);
            // }
        }

        const letters = word.map(letter => ({ ...letter }));

        if (typedWord.length > word.length) {
            const extraLetters = typedWord.slice(word.length).split("").map((letter, pos, array) => ({
                letter,
                className: (pos === array.length && index === cur) ? "current" : "incorrect",
            }));
            letters.push(...extraLetters);
        }

        return (
            <div key={index} className="word">
                {letters.map((letter, i) => (
                    <span key={i} className={letter.className}>
                        {letter.letter}
                    </span>
                ))}
            </div>
        );
    }
    const WORDS_PER_LINE = 10; // Adjust based on your layout
    const LINES_TO_SHOW = 3;
    const WORDS_TO_SHOW = WORDS_PER_LINE * LINES_TO_SHOW;

    return (
        <div className="container">
            <div className="text-container">
                {targetWords
                    .slice(Math.max(0, cur - WORDS_PER_LINE), cur + WORDS_TO_SHOW)
                    .map((word, index) => renderWord(word, index))
                }
            </div>
        </div>
    );
}

                // {targetWords.map((word, index) => renderWord(word, index))}
