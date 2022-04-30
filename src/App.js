
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import {animate,stagger} from 'motion';
let bdayShuStates = {
	"shu_d":"bday_shu_d.png",
	"shu_u":"bday_shu_u.png",
	"shu_l":"bday_shu_l.png",
	"shu_r":"bday_shu_r.png",
};
let normalShuStates = {
	"shu_d":"shu_d.png",
	"shu_u":"shu_u.png",
	"shu_l":"shu_l.png",
	"shu_r":"shu_r.png",
}
let prevShuState =  "shu_d";
let currentShuState = "shu_d";
let previousIndex;
let usedQuotes = [];
let gblScore = 0;




const timelimit = 30;
let elapsedTime = timelimit;

function App() {
	let bdayrange1 = new Date('April 30, 2022 00:00:00 GMT-04:00');
	let bdayrange2 = new Date('May 3, 2022 23:59:59 GMT+04:00');
	let currentDate = new Date();
	let isBday = currentDate.getTime() >= bdayrange1.getTime() && currentDate.getTime() <= bdayrange2.getTime();
	function getShuState(state){

		if (isBday){
			return bdayShuStates[state];
		}
		return normalShuStates[state];
	}
	const [sentText,setSentText] = useState("");
	const [isSent,setIsSent] = useState(false);
	const [showExplosion,setShowExplosion] = useState(false);
	const [shuState,setShuState] = useState(getShuState( "shu_d"));
	const [enteredText, setEnteredText] = useState(''); 
	const [quote, setQuote] = useState('ramen is warm cereal'); 
	const [started, setStarted] = useState(false); 
	const [score, setScore] = useState(0); 
	const [quoteData,setQuoteData] = useState([]);
	const [seenHint,setSeenHint] = useState(localStorage.getItem("seenHint"));
	const [time, setTime] = useState(elapsedTime); 
	const [timerStarted, setTimerStarted] = useState(false); 
	const [isFinished, setIsFinished] = useState(false); 
	const [personalBest, setPersonalBest] = useState(localStorage.getItem("personalBest"));
	const [yaminionImg,setYaminionImg] = useState("yaminion.png");
	const isTyped = (char, index) => {
		if (enteredText.length-1 >= index){
			if (enteredText[index] === char){
				return true;
			}
		}

		return false;
	}
	const checkInput = (input) =>{
		if (input.trimEnd() == quote.text){
			return true;
		}
		else{
			return false;
		}
	}

	const onFormSubmit = (e)=>{
		e.preventDefault();
		if (!seenHint){
			localStorage.setItem("seenHint",true);
			setSeenHint(true);
		}
		if (checkInput(e.target[0].value)){
			setScore(score+1);
			gblScore++;
			setEnteredText("");
			setSentText(e.target[0].value);
			setIsSent(true);
			animate("#sentText",
			{ y: -1000, rotate: 900 },
			{ duration: 1, easing:"linear" });
			setTimeout(()=>{
				document.getElementById("explosionSfx").play();
	
			},150);
			getNextQuote();
			setTimeout(()=>{
				setShowExplosion(true);
				document.getElementById("explosion").src="/images/explosion.gif"
				document.getElementById("explosionSfx").play();
				console.log(quote)
				if (quote.tskr){
					setYaminionImg("yaminion_tskr.png");

				}
				else{
					setYaminionImg("yaminion_ko.png");
				}
				animate("#yaminion",
					{ x:1000, y: -500, rotate: 900 },
					{ duration: 1, easing:"linear"  });
					},250);
	
			setTimeout(()=>{setShowExplosion(false);document.getElementById("explosion").src="";},900)
			setTimeout(()=>{document.getElementById("sentText").removeAttribute('style');setYaminionImg("yaminion.png");
				setIsSent(false);
				animate("#yaminion",
					{ x:[500,0], y: [0,0], rotate: [0,0] },
					{ duration: 0.5, easing:'ease-out'  });
					
			},1500)
		}
		
	}


	const keyAnimate = (e) => {
		var explosionAudio = document.getElementById("explosionSfx");

		if (!isSent){
			if (explosionAudio.currentTime != 0){
				explosionAudio.currentTime = 0;
			}
			if (explosionAudio.readyState<4){
				explosionAudio.load();
			}
		}
		if (!timerStarted)
		{
			setTimerStarted(true);
			
			let interval = setInterval(()=>{
				elapsedTime = elapsedTime - 1; 
				setTime(elapsedTime);
				if (elapsedTime<=0){
					clearInterval(interval);
					setIsFinished(true);
					let pb = localStorage.getItem("personalBest");
					console.log(pb);
					if (pb!= null){

						if (pb < gblScore){
							localStorage.setItem("personalBest",gblScore);
							setPersonalBest(gblScore);
						}
					}
					else{
						localStorage.setItem("personalBest",gblScore);
					}
				}
			},1000);
		}

		prevShuState =  currentShuState;
		if (e.key === "Enter"){
			setShuState(getShuState("shu_r"));
			currentShuState = "shu_r";
		}
		else{
			if (prevShuState === "shu_l"){
				setShuState(getShuState("shu_r"));
				currentShuState = "shu_r";
			}
			else if (prevShuState === "shu_r"){
				setShuState(getShuState("shu_l"));
				currentShuState = "shu_l";
			}
			else{
				setShuState(getShuState("shu_l"));		
				currentShuState = "shu_l";
			}
		}
	}
	const getNextQuote = () => {
		let randomNum =  Math.round(Math.random() * (quoteData.length-1 - 0) + 0);
		if (usedQuotes.length >= quoteData.length){
			usedQuotes = [];
		}
		if (previousIndex!=null){
			while (randomNum == previousIndex || usedQuotes.includes(randomNum)){
				randomNum =  Math.round(Math.random() * (quoteData.length-1 - 0) + 0);
			}
		}
		previousIndex = randomNum;
		usedQuotes.push(randomNum);
		setQuote(quoteData[randomNum]);

	}

	const getData=()=>{
		fetch('data/quotes.json'
		,{
		  headers : { 
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		   }
		}
		)
		  .then(function(response){
			return response.json();
		  })
		  .then(function(json) {
			setQuoteData(json);
			let randomNum =  Math.round(Math.random() * (json.length-1 - 0) + 0);
			setQuote(json[randomNum])
			previousIndex = randomNum;
			usedQuotes.push(randomNum);
		  });
	  };
	  useEffect(()=>{
		getData();
	  },[]);
	  function reset(){
		setTimerStarted(false);
		elapsedTime = timelimit;
		setTime(elapsedTime);
		setScore(0);
		gblScore = 0;
		usedQuotes = [];
		let randomNum =  Math.round(Math.random() * (quoteData.length-1 - 0) + 0);
		setQuote(quoteData[randomNum])
		previousIndex = randomNum;
		usedQuotes.push(randomNum);
		setIsFinished(false);
		setEnteredText("");
	  }
  return (
    <div className="App">
		<div className='boundary'>

			<div className='container'>
			{
				!started?
				<div className='startContainer'>
					<h1>YaminoTyping</h1>
					<img src={`/images/shu/${getShuState("shu_d")}`}></img>
					<h3>Type the quote you see as fast as you can! <br></br>See how high you can score in 30 seconds.</h3>
					<h5 style={{color:'#c9c9c9'}}>*Browser recommended</h5>
					<button onClick={()=>{setStarted(true)}}>Start</button>
				</div>:
				<>
					<audio id="explosionSfx" src="/sfx/explosion.mp3"></audio>
					<h4 id="scoreContainer">Score: {score}</h4>
					<h4 id="timerContainer">Time remaining: {time}</h4>

						<div id="enemyContainer">
								<img className={showExplosion?"show":"hide"} id="explosion" src="/images/explosion.gif"></img>
								<img id="yaminion" src={`/images/yaminion/${yaminionImg}`}></img>
			
						</div>
			
						<div className='typingContainer'> 
							<h2 className={isSent?"show":"hide"} id="sentText">{sentText}</h2>
							{isFinished?
								<div>
									<h1>Finished!</h1>
									<h3>
										Score: {score}
										<br></br>
										Personal best: {personalBest!=null?personalBest:0}
									</h3>
									<button onClick={reset}>Retry</button>
								</div>:
								<div className='formContainer'>
									<form onSubmit={onFormSubmit}>
										<h2 id="textinput">
											{[...quote.text].map((e,index)=>{return <span key={`letter${index}`} className={isTyped(e,index)?"typed":""}>{e}</span>})}
										</h2>
										<input disabled={isFinished} onPaste={(e)=>{e.preventDefault();}} maxLength={50} placeholder={quote.text} autoComplete='off' id="input_phrase" onKeyUp={()=>setShuState(getShuState("shu_u"))}  onChange={e => setEnteredText(e.target.value)} onKeyDown={(e)=>keyAnimate(e)} type="text" value={enteredText}></input>
										<input style={{display:"none"}} disabled={isSent || enteredText.length == 0 || isFinished} type="submit"/>
										<span className={`hint ${!seenHint?"show":"hide"}`}>Press enter to submit</span>
									</form>
								</div>
							}

							<img src={`/images/shu/${shuState}`}></img>
						</div>
				</>
				
			}

		  
				</div>
		</div>

    </div>
  );
}

export default App;
