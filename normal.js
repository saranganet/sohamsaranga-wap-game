import React, { useState, useEffect } from "react";

const WordPuzzleGame = () => {

  const words=[ "REACT", "JAVASCRIPT", "PYTHON", "CODING", "DEVELOPER", "FRONTEND", "BACKEND", "DATABASE", "PROGRAMMING", "ALGORITHM" ];
  const [currentWord,setCurrentWord]=useState("");
  const [grid, setGrid]=useState([]);
  const [inputWord,setInputWord]=useState("");
  const [message, setMessage] = useState("");
  const [score,setScore]=useState(0);
  const [timer, setTimer] = useState(60);
  const [hintUsed,setHintUsed]=useState(false);
  
  useEffect(()=>{
    startNewRound();
    const interval = setInterval(()=>{
      setTimer(prev=>{
        if(prev>0) return prev-1;
        setMessage("⏳ Time's up! Try again.");
        return 0;
      });
    }, 1000);
    return ()=> clearInterval(interval);
  },[]);

  const startNewRound=()=>{
    const word=words[Math.floor(Math.random()*words.length)];
    setCurrentWord(word);
    generateGrid(word);
    setInputWord("");
    setMessage("");
    setTimer(60);
    setHintUsed(false);
  };

  const generateGrid=(word)=>{
    let gridArray=Array(3).fill(null).map(()=>Array(word.length).fill(""));
    let hintIndexes=new Set();
    while(hintIndexes.size<Math.floor(word.length/2)){
      hintIndexes.add(Math.floor(Math.random()*word.length));
    }
    word.split("").forEach((letter,index)=>{
      if(hintIndexes.has(index)) gridArray[1][index]=letter;
    });
    setGrid(gridArray);
  };

  const revealHint=()=>{
    if(!hintUsed){
      let newGrid=[...grid];
      currentWord.split("").forEach((letter,index)=>{
        if(newGrid[1][index]===""){
          newGrid[1][index]=letter;
        }
      });
      setGrid(newGrid);
      setHintUsed(true);
      setScore(score-5);
    }
  };

  const handleInputChange=(e)=>{
    setInputWord(e.target.value.toUpperCase());
  };

  const checkWord=()=>{
    if(inputWord===currentWord){
      setMessage("✅ Correct! You formed the word.");
      setScore(score+10);
      let filledGrid=grid.map(row=>row.map((cell,index)=>currentWord[index]));
      setGrid(filledGrid);
      setTimeout(startNewRound,2000);
    }else{
      setMessage("❌ Incorrect! Try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", color: "white", backgroundColor: "#222", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "10px", color: "#FFD700" }}>Word Puzzle Game</h1>
      <p style={{ fontSize: "20px", marginBottom: "10px" }}>⏳ Time Left: {timer}s | ⭐ Score: {score}</p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${currentWord.length}, 50px)`, gap: "5px", justifyContent: "center", backgroundColor: "#333", padding: "15px", borderRadius: "15px", boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)" }}>
        {grid.flat().map((letter,index)=>(
          <div key={index} style={{ width: "50px", height: "50px", border: "2px solid white", backgroundColor: "#444", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "bold", borderRadius: "8px" }}>
            {letter}
          </div>
        ))}
      </div>
      <input type="text" value={inputWord} onChange={handleInputChange} style={{ marginTop: "20px", fontSize: "20px", padding: "8px", borderRadius: "5px", border: "2px solid white", backgroundColor: "#333", color: "white" }} />
      <button onClick={checkWord} style={{ marginLeft: "10px", fontSize: "20px", padding: "10px 15px", borderRadius: "5px", border: "none", backgroundColor: "#008CBA", color: "white", cursor: "pointer" }}>Submit</button>
      <button onClick={revealHint} disabled={hintUsed} style={{ marginLeft: "10px", fontSize: "20px", padding: "10px 15px", borderRadius: "5px", border: "none", backgroundColor: hintUsed ? "#555" : "#FFA500", color: "white", cursor: hintUsed ? "not-allowed" : "pointer" }}>Hint (-5 points)</button>
      <p style={{ marginTop: "20px", fontSize: "22px", fontWeight: "bold", color: message.includes("Correct") ? "#32CD32" : "#FF6347" }}>{message}</p>
    </div>
  );
};

export default WordPuzzleGame;
