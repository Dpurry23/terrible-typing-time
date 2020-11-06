import logo from "./logo.svg";
import "./App.css";

import { generate } from "./utils/words";
import { useState } from "react";
import { currentTime } from "./utils/time";
import useKeyPress from "./hooks/useKeyPress";

const initialWords = generate();

function App() {
  const [leftPadding, setLeftPadding] = useState(
    new Array(20).fill(" ").join(" ")
  );
  // word generation hooks
  const [outgoingChars, setOutgoingChars] = useState(" ");
  const [currentChar, setCurrentChar] = useState(initialWords.charAt(0));
  const [incomingChars, setIncomingChars] = useState(initialWords.charAt(1));
  // timer hooks
  const [startTime, setStartTime] = useState();
  const [wordCount, setWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  // accuracy hooks
  const [accuracy, setAccuracy] = useState(0);
  const [typedChars, setTypedChars] = useState(" ");

  useKeyPress((key) => {

    if (!startTime) {
      setStartTime(currentTime());
    }

    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;

    if (key === currentChar) {

      if (incomingChars.charAt(0) === " ") {

        setWordCount(wordCount + 1);

        const durationInMinutes = (currentTime() - startTime) / 60000.0;

        setWpm(((wordCount + 1) / durationInMinutes).toFixed(2));
      }
      if (leftPadding.length > 0) {
        setLeftPadding(leftPadding.substring(1));
      }


      updatedOutgoingChars += currentChar;
      setOutgoingChars(updatedOutgoingChars);


      setCurrentChar(incomingChars.charAt(0));


      updatedIncomingChars = incomingChars.substring(1);
      if (updatedIncomingChars.split(" ").length < 10) {
        updatedIncomingChars += " " + generate();
      }
      const updatedTypedChars = typedChars + key;
      setTypedChars(updatedTypedChars);
      //3
      setAccuracy(
          ((updatedOutgoingChars.length * 100) / updatedTypedChars.length).toFixed(
              1,
          ),
      );
      setIncomingChars(updatedIncomingChars);
    }
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="Character">
          <span className="Character-out">
            {(leftPadding + outgoingChars).slice(-20)}
          </span>
          <span className="Character-current">{currentChar}</span>
          <span>{incomingChars.substr(0, 20)}</span>
        </p>
        <h3>WPM: {wpm} | ACC: {accuracy}% </h3>
      </header>
    </div>
  );
}

export default App;
