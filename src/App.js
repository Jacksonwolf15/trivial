import React, { useState, useEffect } from "react";
import { Button, Paper, Typography } from "@material-ui/core";
import QueueAnim from 'rc-queue-anim';

const he = require("he");

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [input, setInput] = useState(0);

  const handleChange = (newInput) => {
    setInput(newInput);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input > 50 || input < 1)
      alert("Please choose a value between 1 and 50.");
    else {
      fetch("https://opentdb.com/api.php?amount=" + input)
        .then((res) => res.json())
        .then((res) => {
          const questions = res.results;
          setQuestions(questions);
        });
      setSubmitted(true);
    }
  };

  if (!submitted) {
    return (
      <div 
      style={{
        minHeight: "100vh",
        color: "white",
        backgroundColor: "#282c34",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "2vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label style={{ fontSize: "3vh" }}>Number of Questions:</label>

          <input
            style={{ margin: "10px" }}
            type="number"
            onChange={(e) => handleChange(e.target.value)}
          />
          

          <Button type="submit" variant="contained" color="secondary">
            Submit
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        justifyContent: "center",
        color: "white",
        backgroundColor: "#282c34",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      
      <Typography variant="h4">Trivial</Typography>

      {questions.map((question) => (
        <Question
          questionText={question.question}
          answers={question.incorrect_answers}
          correctAnswer={question.correct_answer}
          key={question.question}
        />
      ))}
    </div>
  );
}

const Question = ({ questionText, correctAnswer, answers }) => {
  const [answered, setAnswered] = useState(false);
  const [stateAnswers, setStateAnswers] = useState([]);

  useEffect(() => {
    const rand = Math.random() * (answers.length + 1);
    const firstHalf = answers.slice(0, rand);
    const secondHalf = answers.slice(rand);
    setStateAnswers(firstHalf.concat([correctAnswer]).concat(secondHalf));
  }, [answers, correctAnswer]);

  const handleClick = () => {
    setAnswered(true);
  };

  return (
    <QueueAnim duration ="1000" type="right">
    <Paper key = "demo"
      style={{
        textAlign: "center",
        alignItems: "center",
        maxWidth: "40vw",
        padding: "10px",
        margin: "10px",
        
      }}
    >
      <h3 style={{
        textAlign: "center",
        fontWeight: '500',
      }}>
        {he.decode(questionText)}
      </h3>
      <ul>
        {stateAnswers.map((answer) => {
          if (answered) {
            return (
              <Button
                variant="contained"
                style={{
                  alignContent: "center",
                  margin: "5px",
                  left: "-20px",
                  backgroundColor:
                    answer === correctAnswer ? "#52cc49" : "#ff5959",
                }}
                onClick={handleClick}
              >
                {he.decode(answer)}
              </Button>
            );
          }

          return (
            <Button
              variant="contained"
              color="secondary"
              style={{ margin: "5px",
              left: "-20px",}}
              onClick={handleClick}
            >
              {he.decode(answer)}
            </Button>
          );
        })}
      </ul>
    </Paper>
    </QueueAnim>
  );
};