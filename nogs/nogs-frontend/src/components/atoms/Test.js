import { useState, useEffect, useRef } from "react";
import "../../css/Test.css";

export default function Test({ targetText, setGameInfo, setShowResult }) {

    const targetWords = targetText.split(" ");

    const [renderedWords, setRenderedWords] = useState(targetWords.map(word => {
        return {
            lettersTyped: 0,
            letters: word.split("").map(letter => ({
                letter: letter,
                className: "pending",
            }))
        };
    }));

    const [cur, setCur] = useState(0);
    const [startTime, setStartTime] = useState(0);

    const isCorrect = (renderedWord) => {
        if (!renderedWord) return false;
        return renderedWord.letters.every(letter => letter.className === "correct");
    }

    const getAccuracy = () => {

        // reduce funciona como um acumulador, comeca no "0" e vai acumulando no acc
        let sizeTarget = targetWords.reduce((acc, word) => {
            return acc + word.length;
        }, 0);

        let errors = 0;
        renderedWords.forEach(word => {
            errors += word.letters.reduce((acc, letter) => {
                return acc + (letter.className !== "correct" ? 1 : 0);
            }, 0);
        });

        return 1 - (errors / sizeTarget);
    }

    const finishTest = () => {
        const accuracyRaw = getAccuracy();
        const accuracy = +(accuracyRaw * 100).toFixed(
            accuracyRaw * 100 % 1 === 0 ? 0 : (accuracyRaw * 10 % 1 === 0 ? 1 : 2)
        );
        const timeUsedRaw = (Date.now() - startTime) / 1000;
        const timeUsed = +timeUsedRaw.toFixed(timeUsedRaw % 1 === 0 ? 0 : 1);

        const rawRaw = (targetText.length / 5) / timeUsedRaw;
        const raw = Math.round(rawRaw * 60);
        const wpm = Math.round(rawRaw * accuracyRaw * 60);
        setGameInfo({
            accuracy: accuracy,
            timeUsed: timeUsed,
            raw: raw,
            wpm: wpm,
        });
        setShowResult(true);
    };

    const handleBackSpace = (e) => {
        if (renderedWords[cur].lettersTyped === 0 && cur > 0 && !isCorrect(renderedWords[cur - 1])) {
            setCur(cur - 1);
        } else if (renderedWords[cur].lettersTyped > 0) {
            setRenderedWords(prev => {
                const updatedWords = prev.map((word, index) => {
                    if (index !== cur)
                        return word;

                    const newWord = {
                        ...word,
                        letters: word.letters.map(letter => ({ ...letter })),
                    };

                    if (e.ctrlKey || e.metaKey) {

                        newWord.lettersTyped = 0;
                        newWord.letters = newWord.letters.slice(0, targetWords[cur].length).map(letter => ({
                            ...letter,
                            className: "pending",
                        }));

                    } else {

                        if (newWord.lettersTyped > targetWords[cur].length) {
                            newWord.letters = newWord.letters.slice(0, -1);
                        } else {
                            newWord.letters[newWord.lettersTyped - 1].className = "pending";
                        }
                        newWord.lettersTyped--;

                    }
                    return newWord;
                });
                return updatedWords;
            });
        }
    };

    const handleSpace = () => {
        if (renderedWords[cur].lettersTyped > 0) {
            if (cur + 1 >= targetWords.length)
                finishTest();
            setCur(cur + 1);
        }
    }

    const handleNormalKey = (key) => {
        if (startTime === 0) setStartTime(Date.now());

        setRenderedWords(prev => {
            const updatedWords = prev.map((word, index) => {
                if (index === cur) {
                    const newWord = {
                        ...word,
                        letters: word.letters.map((letter, _) => ({
                            ...letter,
                        }))
                    };

                    if (newWord.lettersTyped < targetWords[cur].length) {
                        const expectedLetter = targetWords[cur][newWord.lettersTyped];
                        newWord.letters[newWord.lettersTyped].className = (expectedLetter === key) ? "correct" : "incorrect";
                    } else {
                        newWord.letters.push({ letter: key, className: "extra" });
                    }

                    newWord.lettersTyped++;
                    return newWord;
                }
                return word;
            });
            return updatedWords;
        });
    };


    useEffect(() => {
        setRenderedWords(targetWords.map(word => {
            return {
                lettersTyped: 0,
                letters: word.split("").map(letter => ({
                    letter: letter,
                    className: "pending",
                }))
            };
        }));
        setCur(0);
        setStartTime(0);
    }, [targetText]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Backspace")
                handleBackSpace(e);
            else if (e.key === " ")
                handleSpace();
            else if (e.key.length === 1)
                handleNormalKey(e.key);
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [cur, renderedWords, startTime]);

    const containerRef = useRef(null);
    const currentWordRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && currentWordRef.current) {
            const container = containerRef.current;
            const current = currentWordRef.current;

            const containerRect = container.getBoundingClientRect();
            const currentRect = current.getBoundingClientRect();

            const offset = currentRect.left - containerRect.left;
            const scrollOffset = offset - container.offsetWidth / 2 + current.offsetWidth / 2;

            container.scrollBy({
                left: scrollOffset,
                behavior: "smooth"
            });
        }
    }, [cur]);


    const renderWord = (word, index) => {

        const isCurrentWord = index === cur;

        let firstPendingIndex = -1;

        if (isCurrentWord)
            firstPendingIndex = word.letters.findIndex((letter) => letter.className === "pending");

        return (
            <div
                key={index}
                className="word"
                ref={isCurrentWord ? currentWordRef : null}
            >
                {word.letters.map((letter, i) => {
                    let className = letter.className;
                    if (isCurrentWord && i === firstPendingIndex)
                        className = "current";
                    else if (index < cur && className === "pending")
                        className = "missing";


                    return (
                        <span key={i} className={className}>
                            {letter.letter}
                        </span>
                    );
                })}

                <span className={isCurrentWord && firstPendingIndex === -1 ? "current" : ""}>&nbsp;</span>
            </div>
        );
    };

    const WORDS_PER_LINE = 7;
    const LINES_TO_SHOW = 3;
    const WORDS_TO_SHOW = WORDS_PER_LINE * LINES_TO_SHOW;

    // Calculate the start index for slicing
    const startIndex = Math.max(0, Math.floor(cur / WORDS_PER_LINE) * WORDS_PER_LINE - WORDS_PER_LINE);
    const endIndex = startIndex + WORDS_TO_SHOW;

    return (
        <div className="container">
            <div className="text-container" ref={containerRef}>
                {renderedWords
                    .slice(startIndex, endIndex)
                    .map((wordObj, i) => renderWord(wordObj, startIndex + i))}
            </div>
        </div>
    );
}
