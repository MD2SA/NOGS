import { useState, useEffect } from "react";

export default function MonkeyTypeEffect({phrase}) {
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    // Listen for keydown events globally
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
      {/* Target Text with Dynamic Coloring */}
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

      {/* The input is no longer visible */}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212",
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
