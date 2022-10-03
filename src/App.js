import { useRef, useState } from 'react';
import Login from "./Login";
import useToken from './useToken';
import './style.css'

// Global variables
let ans = 0;
let operations = ["+", "-"];
let [min, max] = [50, 200];
let scoreG = 0;
let countDown = false;
let start = false;
let readyTime = 3;
let gameTime = 30;

function App() {

  // Hooks
  let [text, setText] = useState()
  let [score, setScore] = useState(0);
  let [timer, setTimer] = useState('timer');
  let [leaderboard, setLeaderboard] = useState([]); 
  let [active, setActive] = useState([false, 'none', '']); 
  
  // Using references for the countdowm
  const timerRef = useRef(null);

  // Custom hook to see if user hasa logged in 
  const { token, setToken } = useToken();
  
  if(!token) {
    return <Login setToken={setToken} />
  }

  // Calls backend and returns data
  const backendCall = async (requestOptions, url) => {
      return fetch(url, requestOptions)
          .then(response => response.json());
      }

  //  ------- TIMER -------
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    return {
        total, seconds
    };
  }
  const startTimer = (e, param, message) => {
    let { total, seconds } = getTimeRemaining(e);
    if (total >= 0) {
        setTimer(seconds > 9 ? message + seconds : message + '0' + seconds)
    }
    else{
      if(param == "s")  { // check if we are on the 3 second countdown to begin
        start = true;     // starts the game
        clearInterval(timerRef.current)
        opGen();
        clearTimer(gameTime, "asd", "Time remaining: ")
      }

      // if we are not starting the game we upload our score to the database
      // resetting all posible variables and showing the user their final score
      else {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usern: token, 
            score: scoreG,
            value: JSON.parse(sessionStorage.getItem('token')).value
        })};

        backendCall(requestOptions, process.env.REACT_APP_ADD_SCORE)

        clearInterval(timerRef.current)
        setTimer("Finished! You got a score of " + scoreG + "!")
        start = false;
        scoreG = 0;
        setScore(0);
      }
    }
  }

  const getDeadTime = (t) => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + t);
    return deadline;
  }
  const clearTimer = (t, param, message) => {
    setTimer(t > 9 ? message + t : message + '0' + t);

    let e = getDeadTime(t);

    if (timerRef.current) clearInterval(timerRef.current);
    const id = setInterval(() => {
        startTimer(e, param, message);
    }, 1000)
    timerRef.current = id;
  }

  // ------ END TIMER ------

  // Random generation of the operations
  const opGen = () => {
    let n1_t = Math.floor(min + (Math.random() *(max - min)));
    let n2_t = Math.floor(min + (Math.random() *(n1_t - min)));
    let op = operations[Math.floor(Math.random()*2)];
    setText(n1_t + " " + op + " " + n2_t + " = ");

    switch (op){
      case "+":
        ans = n1_t + n2_t;
        break;
      case "-":
        ans = n1_t - n2_t;
        break;
    }
  }

  // Checks if the input introduced by the user is correct
  const evalOp = (e) => {
    if (e.key == "Enter"){
      e.preventDefault();
      if (e.target.value == ans){
        setScore(++score);
        scoreG = score;
        opGen();
      }
      e.target.value = "";
    }
  }

  // Logout by deleting sessionStorage and clearing all variables
  const logout = () => {
    sessionStorage.removeItem('token')
    scoreG = 0;
    countDown = false;
    start = false;
    clearInterval(timerRef.current)
    setTimer("timer")
    setScore(0);
    setText();
    setToken("");
    setLeaderboard([])
    setActive([false, 'none', '']);
  
  }

  const showLeader = async (e) => {
    setLeaderboard((await backendCall({}, process.env.REACT_APP_LEADERBOARD)).leaderboard);
    setActive([!active[0], active[2], active[1]])
  }

  return (
    <div className="login-wrapper">
      <div className='user'>
        <h1>User: {token}</h1>
        <button className="button-30" onClick={showLeader}>{active[0] ? "Home" : "Leaderboard"}</button>
        <button className="button-30" onClick={logout}>Logout</button>
        </div>
      
      <table style={{display: active[1]}}>
        <tr>
          <th>Position</th>
          <th>User</th>
          <th>Score</th>
        </tr>
        {leaderboard.map((value, index)=> <tr key={index+1}><td>{index+1}</td><td>{value[0]}</td><td>{value[1]}</td></tr>)}
      </table>

      {/*
        Inside div gameArea we use simple logic to manipulate what is being shown next
      */}

      <div style={{display: active[2]}} className='game-area'>
        {countDown ? <h1>{timer}</h1>: ""}
        {!countDown || timer[0] == "F" ? <button className="button-30" onClick={() => {countDown = true;clearTimer(readyTime, "s", "Starting in: ");}}>Play</button> : ""}
        {start ? 
          <div>
            <h3>Score: {score}</h3>
            <div className='flex-strech'>
              <h2>{text}</h2>
              <input className='input-game' onKeyUp={evalOp} autoFocus />
            </div>
          </div> 
          : ""}

      </div>
    </div>
  );
}
//modular exponenciales(modulares) combinacines permutaciones ecuacion diofantica 3⁵⁰⁰00 mod (356)
//ecuacion congruente
//aplicar algoritmo de euclides
//calcular el ineerso de un numero

export default App;
