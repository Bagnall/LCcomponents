import './Blanks.scss';
import {
	AudioClip,
	Word,
} from '../../Components';
import click from '../../sounds/click.mp3';
import error from '../../sounds/error.mp3';
import {
	mouseRelativeTo,
} from '../../mouseUtility';
import React from 'react';
import tada from '../../sounds/tada.mp3';
import Variables from '../../styles/_variables.module.scss';
// import {
// 	handleResponse,
// } from '../../utility';

export class Blanks extends React.PureComponent {

	// Set of phrases with blanks and words to fill those blanks.
	// config is passed from the parent so that multiple exercises are possible.

	constructor(props) {

		super(props);

		// Import some variables from scss (they are also used in other scss files and so should never get out of step unlike duplicated variables).
		let {
			borderWidth,
		} = Variables;
		// They are all strings so let's fix that
		borderWidth = parseInt(borderWidth);

		// Grab some items from the DOM
		this.congratulationsRef = React.createRef();
		this.placeholdersRef = React.createRef();
		this.wordsContainerRef = React.createRef();
		const { config } = props;
		const { words } = config;
		const wordTiles = new Array;
		for (let i = 0; i < words.length; i++) {
			wordTiles.push(<Word
				className={`blank draggable`}
				index={i}
				wordText={words[i]}
				key={`words${i}`}
			/>);
			// PlaceholderTiles.push(<Word
			// 	className={`placeholder blank`}
			// 	index={i}
			// 	wordText={words[i]}
			// 	key={`words${i}`} />);
		}

		this.state = ({
			...config,
			borderWidth: borderWidth,
			margin: 20,
			wordTiles: wordTiles,
		});
	}

	autoSolve = () => {

		// User has had enough, solve it
		// console.log("autoSolve");
		const {
			id,
			wordTiles,
			words,
		} = this.state;

		const newWordTiles = new Array;
		for (let i = 0; i < wordTiles.length; i++) {
			const wordTile = wordTiles[i];

			const { index } = wordTile.props;

			const targetTile = document.querySelector(`#${id} .word${index}.target`);
			// console.log(`targetTile`, targetTile);

			const style = window.getComputedStyle(targetTile);
			let { marginLeft, marginTop } = style;
			marginLeft = parseInt(marginLeft);
			marginTop = parseInt(marginTop);
			const targetX = parseInt(targetTile.offsetLeft - marginLeft);
			const targetY = parseInt(targetTile.offsetTop - marginTop);

			newWordTiles.push(<Word
				className={`blank placed`}
				index={index}
				wordText={words[i]}
				x={targetX}
				y={targetY}
				key={`Word${index}`} />);

		}
		this.setState({
			wordTiles: newWordTiles,
		});
	};

	handleHints = (e) => {
		// console.log("handleHints", e);
		this.setState({showHints: e.target.checked});
	};

	handleMouseDown = (e) => {
		// console.log("handleMouseDown", e);
		if (e.button && e.button !== 0) return;
		e.preventDefault();
		e.stopPropagation();
		const {
			id,
			firstMouseDown = true,
		} = this.state;

		if (firstMouseDown) {
			// Convert all words to absolute position so they animate properly
			this.setState({ firstMouseDown: false });

			// Fix container size
			const { width, height } = window.getComputedStyle(this.wordsContainerRef.current);
			// console.log("width", width, "height", height);
			this.wordsContainerRef.current.style.width = width;
			this.wordsContainerRef.current.style.height = height;

			// draggable words (relatively positioned)
			const draggables = document.querySelectorAll(`#${id} .draggable`);
			// console.log("draggables", draggables, `#${id} .draggable`);
			const coords = new Array;
			for (let i = 0; i < draggables.length; i++) {
				const draggable = draggables[i];
				const style = window.getComputedStyle(draggable);
				// console.log(draggable);
				coords.push({
					x: `${draggable.offsetLeft - parseInt(style.paddingLeft)}px`,
					y: `${draggable.offsetTop - parseInt(style.marginTop)}px`
				});
			}
			for (let i = 0; i < draggables.length; i++){
				const draggable = draggables[i];
				draggable.style.left = coords[i].x;
				draggable.style.top = coords[i].y;
				draggable.style.position = `absolute`;
			}
		}

		if (e.target.classList.contains('word') && (e.target.classList.contains('draggable') || e.target.classList.contains('dragged'))) { // Not context menu (right mouse)
			this.movingPiece = e.target;
			const cl = this.movingPiece.classList;

			// console.log(`#${id} .placeholder.${cl[0]}`);
			const startWord = document.querySelector(`#${id} .draggable.${cl[0]}`);


			if (startWord) {

				const swStyles = window.getComputedStyle(startWord);
				// Starting point in case we want to return it
				this.startX = parseInt(startWord.offsetLeft) - parseInt(swStyles.marginLeft);
				this.startY = parseInt(startWord.offsetTop) - parseInt(swStyles.marginTop);

				// console.log("wcLeft", wcLeft, "wcTop", wcTop, "startX", this.startX, "startY", this.startY);
				// Start the drag with a friendly offset
				let { height, marginLeft, marginTop, paddingLeft, paddingTop, width } = window.getComputedStyle(this.movingPiece);
				height = parseInt(height);
				marginLeft = parseInt(marginLeft);
				marginTop = parseInt(marginTop);
				paddingLeft = parseInt(paddingLeft);
				paddingTop = parseInt(paddingTop);
				width = parseInt(width);
				let { x: relMouseX, y: relMouseY } = mouseRelativeTo(e, '.blanks-container', 1);
				relMouseX -= width / 2 + marginLeft + paddingLeft;
				relMouseY -= height / 2 + marginTop + paddingTop;
				if (relMouseX && relMouseY) {
					this.movingPiece.style.left = `${relMouseX}px`;
					this.movingPiece.style.top = `${relMouseY}px`;
				}

				e.target.classList.add("dragging");
			}
		}
	};

	handleMouseMove = (e) => {
		// console.log("handleMouseMove",e)

		if (this.movingPiece && this.movingPiece.classList.contains("dragging")) {
			let { height, marginLeft, marginTop, paddingLeft, paddingTop, width } = window.getComputedStyle(this.movingPiece);
			height = parseInt(height);
			marginLeft = parseInt(marginLeft);
			marginTop = parseInt(marginTop);
			paddingLeft = parseInt(paddingLeft);
			paddingTop = parseInt(paddingTop);
			width = parseInt(width);
			let { x: relMouseX, y: relMouseY } = mouseRelativeTo(e, '.blanks-container', 1);
			relMouseX -= width / 2 + marginLeft + paddingLeft;
			relMouseY -= height / 2 + marginTop + paddingTop;

			// Drag via centre of word (not top left)
			// console.log("relMouseX",relMouseX,"relMouseY",relMouseY)
			if (relMouseX && relMouseY) {
				this.movingPiece.style.left = `${relMouseX}px`;
				this.movingPiece.style.top = `${relMouseY}px`;

				if (this.inLimits())
					this.movingPiece.classList.add('highlight');
				else
					this.movingPiece.classList.remove('highlight');
			}
		}
	};

	handleMouseUp = () => {
		// console.log("handleMouseUp", e)

		const tadaAudio = new Audio(tada);
		const clickAudio = new Audio(click);
		const errorAudio = new Audio(error);
		let {
			failCount = 0,
		} = this.state;

		// Check valid spot and valid set of tiles
		if (this.movingPiece) {
			this.movingPiece.classList.remove("dragging");
			// this.movingPiece.classList.remove("draggable");
			// this.movingPiece.classList.add("dragged");
			// console.log("Removed dragging");
			// this.movingPiece.classList.remove('highlight');
			// this.movingPiece.classList.remove('dragging');
			// Check to see if it is close enough to its intended position
			const {
				congratulationsText,
				words,
			} = this.state;
			let {
				nPlaced = 0,
			} = this.state;

			let targetX, targetY;
			if ({ targetX, targetY } = this.inLimits()) {
				// The eagle has landed
				this.movingPiece.classList.remove("draggable");
				this.movingPiece.classList.remove('highlight');
				clickAudio.play();

				this.movingPiece.style.left = `${targetX}px`;
				this.movingPiece.style.top = `${targetY}px`;
				this.movingPiece.classList.add("placed");
				nPlaced++;
				if (nPlaced === words.length) {

					// Last piece of the jigsaw placed
					// this.congratulationsRef.current.classList.add("show");
					const { showDialog } = this.props;
					showDialog(congratulationsText);
					tadaAudio.play();
					this.setState({
						complete: true,
					});
				}
				this.setState({
					nPlaced: nPlaced
				});
			} else {

				// Nowhere near!
				this.movingPiece.style.left = `${this.startX}px`;
				this.movingPiece.style.top = `${this.startY}px`;
				// console.log("Set left & top");
				failCount++;
				this.setState({
					failCount: failCount
				});
				errorAudio.play();
			}
			this.movingPiece = undefined;
		}
	};

	inLimits = () => {

		// Is the piece close to its target position? Enough to show hint highlight or snap it in?
		const {
			id,
			margin,
		} = this.state;

		const cl = this.movingPiece.classList;
		// let targetWord = document.getElementsByClassName(`target ${cl[0]}`);
		const targetWord = document.querySelector(`#${id} .target.${cl[0]}`);
		// console.log(`target ${cl[0]}`)
		let targetX, targetY;
		if (targetWord) {
			// console.log("targetWord")
			// targetWord = targetWord[0];
			// To find out target point
			// console.log(targetWord);

			// targeting point in case we want to return it
			const style = window.getComputedStyle(targetWord);
			let { marginLeft, marginTop } = style;
			marginLeft = parseInt(marginLeft);
			marginTop = parseInt(marginTop);
			targetX = parseInt(targetWord.offsetLeft - marginLeft);
			targetY = parseInt(targetWord.offsetTop - marginTop);
		}

		// console.log("targetX", targetX, "targetY", targetY);
		let { left, top } = this.movingPiece.style;
		left = parseInt(left);
		top = parseInt(top);
		// console.log("left",left,"top",top,"margin",margin)
		if (Math.abs(left - targetX) < margin && Math.abs(top - targetY) < margin) {
			// console.log("inLimits");
			return {"targetX":targetX, "targetY":targetY};
		}
		return false;
	};

	render = () => {
		const {
			audio,
			complete = false,
			cheatText,
			failCount,
			id = '',
			instructionsText,
			showHints = false,
			showHintsText,
			phrases = [],
			words = [],
			wordTiles,
		} = this.state;

		const phraseList = new Array;

		const reg = /\]| /;
		for (let i = 0; i < phrases.length; i++) {
			const phraseSplit = phrases[i].split(reg);
			const phrase = new Array;
			for (let j = 0; j < phraseSplit.length; j++) {
				if (phraseSplit[j][0] === '[') {
					// span it as a target!
					// word${index} must be the first class
					const cleanedPhraseSplit = phraseSplit[j].replace('[', '').replace(']', '');

					// Find the corresponding placeholder to determine its correct index
					let foundIndex;
					for (let i = 0; i < words.length; i++) {
						if (words[i] === cleanedPhraseSplit) foundIndex = i;
					}
					phrase.push(<span
						className={`word${foundIndex} word blank target `}
						key={`phraseSpan${i}-${j}`}>{cleanedPhraseSplit} </span>);
				}
				else {
					phrase.push(<span className='word' key={`phraseSpan${i}-${j}`}>{phraseSplit[j]} </span>);
				}
			}
			// console.log("phrases", audio)
			const soundFile = `src/Components/Blanks/sounds/${audio[i]}`;
			phraseList.push(
				<li key={`phrase${i}`}><div className='phrase'>{phrase}</div> <AudioClip
					listenText={`Hear the phrase`}
					soundFile={soundFile}
				/></li>
			);
		}
		// console.log("id", id);
		return (
			<div
				className={`blanks-container ${complete ? 'complete' : ''}`}
				id={`${id ? id : ''}`}
				onMouseDown={this.handleMouseDown}
				onMouseMove={this.handleMouseMove}
				onMouseUp={this.handleMouseUp}
				onTouchStart={this.handleMouseDown}
				onTouchMove={this.handleMouseMove}
				onTouchEnd={this.handleMouseUp}
			>
				<p>{instructionsText}</p>

				<div className='help'>
					<label className={`hidden-help ${failCount >= 2 ? 'show' : ''}`}>{showHintsText}: <input type='checkbox' onChange={this.handleHints} /></label>
					<button className={`hidden-help ${failCount >= 2 ? 'show' : ''}`} onClick={this.autoSolve}>{cheatText}</button>&nbsp;
				</div>
				<div
					className={`blanks ${showHints ? 'show-hints' : ''}`}
					onMouseDown={this.handleMouseDown}
					onMouseMove={this.handleMouseMove}
					onMouseUp={this.handleMouseUp}
					onTouchStart={this.handleMouseDown}
					onTouchMove={this.handleMouseMove}
					onTouchEnd={this.handleMouseUp}
				>
					{/* <div className={`placeholders`} ref={this.placeholdersRef}>{PlaceholderTiles}</div> */}
					<div className={`words-container`} ref={this.wordsContainerRef}>
						{wordTiles}
					</div>
					<div
						className='target'
						onMouseDown={this.handleMouseDown}
						onMouseMove={this.handleMouseMove}
						onMouseUp={this.handleMouseUp}
						onTouchStart={this.handleMouseDown}
						onTouchMove={this.handleMouseMove}
						onTouchEnd={this.handleMouseUp}
					>
						<ul>
							{phraseList}
						</ul>
					</div>
				</div>
			</div>
		);
	};
}
