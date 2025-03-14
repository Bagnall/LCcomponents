import './Jigsaw.scss';
import {
	Piece,
} from '../../Components';
import React from 'react';
import Variables from '../../styles/_variables.module.scss';
import {
	arrayIncludesObject,
	handleResponse,
} from '../../utility';
import {
	mouseRelativeTo,
} from '../../mouseUtility';
import tada from './sounds/tada.mp3'
import click from './sounds/click.mp3'
import error from './sounds/error.mp3'

export class Jigsaw extends React.PureComponent {

	// Contains a location for unplaced pieces and a target to drag them to.
	// config.json enables the text to be changed for different languages/content.
	// correct.jpg and incorrect.jpg can be changed out.
	// The pieces are randomised from the correct image and from the incorrect image. 
	// The point is for the student to read the description of the final puzzle image and choose pieces accordingly.

	constructor(props) {
		super(props);

		// Import some variables from scss (they are also used in other scss files and so should never get out of step unlike duplicated variables).
		let {
			piecesPerBoard,
			boardWidth,
			boardHeight,
			borderWidth,
			tabSize,
			tileSize,
		} = Variables;
		// They are all strings so let's fix that
		piecesPerBoard = parseInt(piecesPerBoard);
		boardWidth = parseInt(boardWidth);
		boardHeight = parseInt(boardHeight);
		tabSize = parseInt(tabSize);
		tileSize = parseInt(tileSize);
		borderWidth = parseInt(borderWidth);

		// We will use Pieces to build up our JSX for the pieces
		let Pieces = new Array;
		let usedSpaces = new Array; // So we can track where pieces have been randomised to and therefore not get conflicts

		// Initial x,y
		let r = Math.random();
		let x = parseInt(r * boardWidth);
		r = Math.random();
		let y = parseInt(r * boardHeight);

		for (let i = 1; i <= piecesPerBoard * 2; i++) {
			// Keep trying again if the space is taken
			while (arrayIncludesObject({ x: x, y: y }, usedSpaces)) {
				r = Math.random();
				x = parseInt(r * boardWidth * 2);
				r = Math.random();
				y = parseInt(r * boardHeight);
			}

			// Found an empty space
			usedSpaces.push({ x: x, y: y }); // Stop it being reused

			// Add the piece
			// correctx and correcty are valid place where the piece can be placed in the puzzle
			Pieces.push(<Piece
				index={i}
				// correctImage={correctImage}
				correctx={(i - 1) % boardWidth}
				correcty={parseInt((i - 1) / boardWidth)}
				correctSet={i <= piecesPerBoard}
				handleMouseDown={this.handleMouseDown}
				handleMouseMove={this.handleMouseMove}
				handleMouseUp={this.handleMouseUp}
				// incorrectImage={incorrectImage}
				x={x * tileSize}
				y={y * tileSize}
				key={`Piece${i}`}
				style={{"color":"red" , "backgroundImage":"./images/incorrect.jpg"}}
			/>);
		}

		// Grab some itmes from the DOM
		this.congratulationsRef = React.createRef();
		this.jigsawRef = React.createRef();
		this.targetRef = React.createRef();

		this.state = ({
			Pieces: Pieces,
			borderWidth: borderWidth,
			margin: tileSize / 6,
			piecesPerBoard: piecesPerBoard,
			tabSize: tabSize,
			tileSize: tileSize,
		});
	}

	componentDidMount = () => {

		// Read the config
		const headers = new Headers();
		headers.append("Content-Type", "application/json");

		const requestOptions = {
			headers: headers,
			method: 'GET',
			redirect: 'follow',
		};

		fetch(`${window.location.origin}/src/Components/Jigsaw/config.json`, requestOptions)
			.then(handleResponse)
			.then(res => {
				this.setState(res);
			})
			.catch(error => {
				const action = `Retrieving configuration`;
				console.error(action, error);
			});

		// Deduce the scale in use for this media break
		const jigsaw = this.jigsawRef.current;
		this.scale = jigsaw.getBoundingClientRect().width / jigsaw.offsetWidth;

	};

	autoSolve = () => {

		// User has had enough, solve it
		// console.log("autoSolve");
		const {
			borderWidth,
			correctImage,
			incorrectImage,
			tabSize,
			tileSize,
		} = this.state;
		const targetTray = this.targetRef.current;

		const targetTrayX = parseInt(window.getComputedStyle(targetTray).left);
		const targetTrayY = parseInt(window.getComputedStyle(targetTray).top);

		const { Pieces } = this.state;

		const newPieces = new Array;
		for (let i = 0; i < 40; i++) {
			let piece = Pieces[i];
			const { index, correctSet, correctx, correcty, x, y } = piece.props;
			if (i < 20) {
				let targetX, targetY;
				if (correctSet) {
					targetX = (correctx * (tileSize - tabSize * 2) - tabSize) + targetTrayX + borderWidth; //-targetTrayX;
					targetY = (correcty * (tileSize - tabSize * 2) - tabSize) + targetTrayY + borderWidth; //-targetTrayY;
				} else {
					targetX = x;
					targetY = y;
				}
				newPieces.push(<Piece
					index={index}
					correctImage={correctImage}
					correctSet={correctSet}
					handleMouseDown={() => { }}
					handleMouseMove={() => { }}
					handleMouseUp={() => { }}
					incorrectImage={incorrectImage}
					correctx={correctx}
					correcty={correcty}
					x={targetX}
					y={targetY}
					key={`Piece${index}`} />);
			} else {
				newPieces.push(<Piece
					index={index}
					correctImage={correctImage}
					correctSet={correctSet}
					handleMouseDown={() => { }}
					handleMouseMove={() => { }}
					handleMouseUp={() => { }}
					incorrectImage={incorrectImage}
					correctx={correctx}
					correcty={correcty}
					x={x}
					y={y}
					key={`Piece${index}`} />)
			}
		}
		this.setState({
			Pieces: newPieces,
		})
	}

	handleHints = (e) => {
		// console.log("handleHints", e);
		this.setState({showHints: e.target.checked})
	}

	handleMouseDown = (e) => {
		// console.log("handleMouseDown", e)
		if (e.button && e.button !== 0) return;
		if (e.target.classList.contains('piece') && !e.target.classList.contains('placed')) { // Not context menu (right mouse)
			this.movingPiece = e.target;

			// Starting point in case we want to return it
			const style = window.getComputedStyle(this.movingPiece);
			this.startX = parseInt(style.left);
			this.startY = parseInt(style.top);

			e.target.classList.add("dragging");
		}
	};

	handleMouseMove = (e) => {
		// console.log("handleMouseMove",e)
		const { tileSize } = this.state;
		if (this.movingPiece && this.movingPiece.classList.contains("dragging")) {
			let { x: relMouseX, y: relMouseY } = mouseRelativeTo(e, '.jigsaw', this.scale);

			// Drag via centre of piece (not top left)
			relMouseX = parseInt(relMouseX - tileSize / 2);
			relMouseY = parseInt(relMouseY - tileSize / 2);

			this.movingPiece.style.left = `${relMouseX}px`;
			this.movingPiece.style.top = `${relMouseY}px`;

			if (relMouseY - this.startY > 100 && !this.movingPiece.classList.contains("correct-set")) {
				this.movingPiece.classList.add('wrong-set');
			} else {
				this.movingPiece.classList.remove('wrong-set')
			}

			if (this.inLimits())
				this.movingPiece.classList.add('highlight')
			else
				this.movingPiece.classList.remove('highlight')
		}
	};

	handleMouseUp = (e) => {
		// console.log("handleMouseUp", e)
		e.target.classList.remove("dragging");
		const targetTray = this.targetRef.current;
		let tadaAudio = new Audio(tada);
		let clickAudio = new Audio(click);
		let errorAudio = new Audio(error);
		let {
			failCount=0,
		} = this.state;

		// Check valid spot and valid set of tiles
		if (this.movingPiece != undefined && !this.movingPiece.classList.contains('correct-set')) {
			// Not from the correct set of pieces
			errorAudio.play();
			this.movingPiece.style.left = `${this.startX}px`;
			this.movingPiece.style.top = `${this.startY}px`;
			failCount++;
			this.setState({
				failCount: failCount
			})
		} else if (this.movingPiece != undefined) {
			// Check to see if it is close enough to its intended position
			const {
				borderWidth,
				congratulationsText,
				piecesPerBoard,
				tabSize,
				tileSize,
			} = this.state;
			let {
				nPlaced = 0,
			} = this.state;
			const correctx = parseInt(this.movingPiece.getAttribute('correctx'));
			const correcty = parseInt(this.movingPiece.getAttribute('correcty'));
			const targetTrayX = parseInt(window.getComputedStyle(targetTray).left);
			const targetTrayY = parseInt(window.getComputedStyle(targetTray).top);
			const targetX = (correctx * (tileSize - tabSize * 2) - tabSize); //-targetTrayX;
			const targetY = (correcty * (tileSize - tabSize * 2) - tabSize); //-targetTrayY;

			if (this.inLimits()) {
				// The eagle has landed
				clickAudio.play();
				this.movingPiece.style.left = `${targetX + targetTrayX + borderWidth}px`;
				this.movingPiece.style.top = `${targetY + targetTrayY + borderWidth}px`;
				this.movingPiece.classList.add("placed");
				nPlaced++;
				if (nPlaced === piecesPerBoard) {

					// Last piece of the jigsaw placed
					// this.congratulationsRef.current.classList.add("show");
					const { showDialog } = this.props;
					showDialog(congratulationsText)
					tadaAudio.play();
				}
				this.setState({ nPlaced: nPlaced });
			} else {

				// Nowhere near!
				this.movingPiece.style.left = `${this.startX}px`;
				this.movingPiece.style.top = `${this.startY}px`;
				failCount++;
				this.setState({
					failCount: failCount
				})
				errorAudio.play();
			}
		}
		if (this.movingPiece) {
			this.movingPiece.classList.remove('highlight');
			this.movingPiece.classList.remove('wrong-set')
		}
		this.movingPiece = undefined;
	};

	inLimits = () => {

		// Is the piece close to its target position? Enough to show hint highlight or snap it in?
		const {
			margin,
			tabSize,
			tileSize,
		} = this.state;
		const targetTray = this.targetRef.current;
		const correctx = parseInt(this.movingPiece.getAttribute('correctx'));
		const correcty = parseInt(this.movingPiece.getAttribute('correcty'));
		const targetTrayX = parseInt(window.getComputedStyle(targetTray).left);
		const targetTrayY = parseInt(window.getComputedStyle(targetTray).top);
		const targetX = (correctx * (tileSize - tabSize * 2) - tabSize);
		const targetY = (correcty * (tileSize - tabSize * 2) - tabSize);
		let { left, top } = this.movingPiece.style;
		left = parseInt(left);
		top = parseInt(top);
		if (Math.abs(left - targetTrayX - targetX) < margin && Math.abs(top - targetTrayY - targetY) < margin) {
			return true;
		}
		return false;
	}

	render = () => {
		const {
			cheatText,
			descriptionText,
			failCount,
			instructionsText,
			listenDescriptionText,
			Pieces,
			showHints = false,
			showHintsText,
		} = this.state;

		return (
			<div
				className='jigsaw-container'
				onMouseDown={this.handleMouseDown}
				onMouseMove={this.handleMouseMove}
				onMouseUp={this.handleMouseUp}
			>
				<p>{instructionsText}</p>
				<p className='clue'>{descriptionText}&nbsp;</p>
			

				<label className='audio-clip'>{listenDescriptionText}:&nbsp;<audio controls src="src/Components/Jigsaw/sounds/description.mp3"></audio></label>

				<div className='help'>
					<label className={`hidden-help ${failCount >= 2 ? 'show' : ''}`}>{showHintsText}: <input type='checkbox' onChange={this.handleHints} /></label>
					<button className={`hidden-help ${failCount >= 2 ? 'show' : ''}`} onClick={this.autoSolve}>{cheatText}</button>&nbsp;
				</div>
				<div
					className={`jigsaw ${showHints ? 'show-hints' : ''}`}
					onMouseDown={this.handleMouseDown}
					onMouseMove={this.handleMouseMove}
					onMouseUp={this.handleMouseUp}
					ref={this.jigsawRef}
				>
					{Pieces}
					<div
						className='target'
						onMouseDown={this.handleMouseDown}
						onMouseMove={this.handleMouseMove}
						onMouseUp={this.handleMouseUp}
						ref={this.targetRef}
					>
					</div>
				</div>
			</div>
		);
	};
}
