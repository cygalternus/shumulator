import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import {animate,stagger} from 'motion';
let prevShuState =  "shu_d.png";
let currentShuState = "shu_d.png";
let currentText = "";
let fired = false;
function App() {
	const [sentText,setSentText] = useState("");
	const [isSent,setIsSent] = useState(false);
	const [showExplosion,setShowExplosion] = useState(false);
	const [shuState,setShuState] = useState("shu_d.png");
	const [enteredText, setEnteredText] = useState(''); 
	const [quote, setQuote] = useState('ramen is warm cereal'); 

	const [yaminionImg,setYaminionImg] = useState("yaminion.png");
	const isTyped = (char, index) => {
		if (enteredText.length-1 >= index){
			if (enteredText[index] === char){
				return true;
			}
		}
		// if ((enteredText[enteredText.length-1] === char) || ){
		// 	return true;
		// }
		return false;
	}
	const onFormSubmit = (e)=>{
		console.log("send")
		e.preventDefault();
		setEnteredText("");
		setSentText(e.target[0].value);
		setIsSent(true);
		animate("#sentText",
		{ y: -1000, rotate: 900 },
		{ duration: 1, easing:"linear" });
		setTimeout(()=>{
			document.getElementById("explosionSfx").play();

		},150);
		setQuote("you can sous vide steak in a dishwasher")
		setTimeout(()=>{
			setShowExplosion(true);
			document.getElementById("explosion").src="/images/explosion.gif"
			document.getElementById("explosionSfx").play();
			setYaminionImg("yaminion_ko.png");
			animate("#yaminion",
				{ x:1000, y: -500, rotate: 900 },
				{ duration: 1, easing:"linear"  });
				},250);

		setTimeout(()=>{setShowExplosion(false);document.getElementById("explosion").src="";},900)
		setTimeout(()=>{document.getElementById("sentText").removeAttribute('style');setYaminionImg("yaminion.png");
			setIsSent(false);
			// document.getElementById("yaminion").style.transform.rotate = 0;
			animate("#yaminion",
				{ x:[500,0], y: [0,0], rotate: [0,0] },
				{ duration: 0.5, easing:'ease-out'  });
				
		},1500)
	}
	const createYaminion = () => {
		const enemyContainer = document.getElementById("enemyContainer");
		let yaminion = document.createElement("img");
		yaminion.classList.add('yaminion');
		yaminion.src = `/images/yaminion/${yaminionImg}`;
		enemyContainer.append(yaminion);

	//	<img class="yaminion" src={`/images/yaminion/${yaminionImg}`}></img>

		enemyContainer.append(yaminion);
	}
	const removeElementsByClass = (className) => {
		const elements = document.getElementsByClassName(className);
		while(elements.length > 0){
			elements[0].parentNode.removeChild(elements[0]);
		}
	}
	const keyAnimate = (e) => {
		var explosionAudio = document.getElementById("explosionSfx");
		console.log("audio state",explosionAudio.readyState);

		if (!isSent){
			explosionAudio.currentTime = 0;
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
	// useEffect(() => {
	// 	document.addEventListener('keydown', (e)=>{
	// 		if (!fired){
	// 			fired = true;
	// 			console.log(e)
	// 			console.log(e.keyCode);
	// 			if ((e.keyCode>= 48 && e.keyCode <= 122) || e.keyCode == 32 || e.keyCode ==  190 || e.keyCode == 222 || e.keyCode == 188 || e.keyCode == 108 ){
	// 				currentText = currentText + e.key; 
	// 				setEnteredText(currentText);
	// 			}
	// 			else if (e.keyCode == 8 || e.keyCode == 46){
	// 				console.log(e.keyCode)
	// 				currentText = currentText.substring(0, currentText.length - 1)
	// 				setEnteredText(currentText);

	// 			}


	// 		}; 
	// 	});
	// 	document.addEventListener('keyup', (e)=>{fired = false});

	//   }, []);
	
  return (
    <div className="App">
		<div className='boundary'>
		<div className='container'>
	  <audio id="explosionSfx" src="/sfx/explosion.mp3"></audio>
	  <div id="scoreContainer">Score</div>
		  <div id="enemyContainer">
			  	<img className={showExplosion?"show":"hide"} id="explosion" src="/images/explosion.gif"></img>
		  		<img id="yaminion" src={`/images/yaminion/${yaminionImg}`}></img>

		  </div>

		  <div className='typingContainer'> 
		  		<h2 className={isSent?"show":"hide"} id="sentText">{sentText}</h2>

				<div className='formContainer'>
					<form onSubmit={onFormSubmit}>
						<h2 id="textinput">
							{[...quote].map((e,index)=>{return <span className={isTyped(e,index)?"typed":""}>{e}</span>})}
						</h2>
						<input maxLength={50} placeholder={quote} autoComplete='off' id="input_phrase" onKeyUp={()=>setShuState("shu_u.png")}  onChange={e => setEnteredText(e.target.value)} onKeyDown={(e)=>keyAnimate(e)} type="text" value={enteredText}></input>
						<input style={{display:"none"}} disabled={isSent || enteredText.length == 0} type="submit"/>

					</form>
				</div>

				<img src={`/images/shu/${shuState}`}></img>
		  </div>

	  </div>
		</div>

    </div>
  );
}

export default App;
