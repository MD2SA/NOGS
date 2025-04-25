import { useState, useEffect } from "react";

export default function Test({phrase,setGameInfo}) {
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace") {
        setInputText((prevText) => prevText.slice(0, -1));
      } else if (e.key.length === 1) {
        setInputText((prevText) => prevText + e.key);
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        {phrase.split("").map((char, index) => {
          let color = "gray";
          if (index < inputText.length) {
            color = inputText[index] === char ? "green" : "red";
          }

          return (
            <span key={index} style={{ color }}>
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontFamily: "monospace",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  textContainer: {
    fontSize: "24px",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#1e1e1e",
    minHeight: "40px",
    marginBottom: "20px",
  },
};
