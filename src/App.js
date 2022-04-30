
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import {animate,stagger} from 'motion';
let prevShuState =  "shu_d.png";
let currentShuState = "shu_d.png";
let previousIndex;
let usedQuotes = [];
function App() {

	const [sentText,setSentText] = useState("");
	const [isSent,setIsSent] = useState(false);
	const [showExplosion,setShowExplosion] = useState(false);
	const [shuState,setShuState] = useState("shu_d.png");
	const [enteredText, setEnteredText] = useState(''); 
	const [quote, setQuote] = useState('ramen is warm cereal'); 
	const [started, setStarted] = useState(false); 
	const [score, setScore] = useState(0); 
	const [quoteData,setQuoteData] = useState([]);

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

		if (checkInput(e.target[0].value)){
			setScore(score+1);
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
	const createYaminion = () => {
		const enemyContainer = document.getElementById("enemyContainer");
		let yaminion = document.createElement("img");
		yaminion.classList.add('yaminion');
		yaminion.src = `/images/yaminion/${yaminionImg}`;
		enemyContainer.append(yaminion);


		enemyContainer.append(yaminion);
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

		prevShuState =  currentShuState;
		if (e.key === "Enter"){
			setShuState("shu_r.png");
			currentShuState = "shu_r.png";
		}
		else{
			if (prevShuState === "shu_l.png"){
				setShuState("shu_r.png");
				currentShuState = "shu_r.png";
			}
			else if (prevShuState === "shu_r.png"){
				setShuState("shu_l.png");
				currentShuState = "shu_l.png";
			}
			else{
				setShuState("shu_l.png");		
				currentShuState = "shu_l.png";
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
  return (
    <div className="App">
		<div className='boundary'>

			<div className='container'>
			{
				!started?
				<div><button onClick={()=>{setStarted(true)}}>Start</button></div>:
				<>
					<audio id="explosionSfx" src="/sfx/explosion.mp3"></audio>
					<div id="scoreContainer">Score: {score}</div>
						<div id="enemyContainer">
								<img className={showExplosion?"show":"hide"} id="explosion" src="/images/explosion.gif"></img>
								<img id="yaminion" src={`/images/yaminion/${yaminionImg}`}></img>
			
						</div>
			
						<div className='typingContainer'> 
								<h2 className={isSent?"show":"hide"} id="sentText">{sentText}</h2>
			
							<div className='formContainer'>
								<form onSubmit={onFormSubmit}>
									<h2 id="textinput">
										{[...quote.text].map((e,index)=>{return <span className={isTyped(e,index)?"typed":""}>{e}</span>})}
									</h2>
									<input  onPaste={(e)=>{e.preventDefault();}} maxLength={50} placeholder={quote.text} autoComplete='off' id="input_phrase" onKeyUp={()=>setShuState("shu_u.png")}  onChange={e => setEnteredText(e.target.value)} onKeyDown={(e)=>keyAnimate(e)} type="text" value={enteredText}></input>
									<input style={{display:"none"}} disabled={isSent || enteredText.length == 0} type="submit"/>
			
								</form>
							</div>
			
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
