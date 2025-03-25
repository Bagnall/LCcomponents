import './WordParts.scss';
import {
	AudioClip,
} from '..';
import error from '../../sounds/error.mp3';
import React from 'react';
import tada from '../../sounds/tada.mp3';
import wof from '../../sounds/wheel-of-fortune.mp3';

export class WordParts extends React.PureComponent {

	// Table of phrases with translatiopns column and sound files column.
	// config is passed from the parent so that multiple exercises are possible.

	constructor(props) {
		super(props);
		this.state = ({
			...props.config,
			failCount: 0,
		});

	}

	autoSolve = () => {
		// console.log("autoSolve");
		const {
			id = [],
		} = this.state;
		const targets = document.querySelectorAll(`#${id} span.target`);
		const wofAudio = new Audio(wof);
		// console.log("handlePartWordClick");
		wofAudio.play();

		for (let i = 0; i < targets.length; i++){
			targets[i].classList.add('animate');
		}
	};

	handlePartWordClick = (e) => {
		const tadaAudio = new Audio(tada);
		const wofAudio = new Audio(wof);
		// console.log("handlePartWordClick");
		wofAudio.play();
		const {
			congratulationsText,
		} = this.state;
		let {
			nPlaced = 0,
		} = this.state;
		e.target.classList.add("animate");
		nPlaced++;
		if (nPlaced === this.nToSolve){

			// Last piece of the jigsaw placed
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
	};

	handlePartWordError = (e) => {
		// console.log("handlePartWordError");
		const errorAudio = new Audio(error);
		let { failCount } = this.state;
		errorAudio.play();
		e.target.classList.add("error");

		failCount++;
		this.setState({
			failCount: failCount
		});
	};

	render = () => {
		const {
			audio,
			cheatText,
			failCount = 0,
			id = [],
			instructionsText,
			nPlaced = 0,
			phrases,
			// showHintsText,
		} = this.state;

		const phraseList = new Array;
		let nToSolve = 0;

		const reg = /(\[.*?\])/;
		for (let i = 0; i < phrases.length; i++) {
			// console.log("phrase", phrases[i]);
			const phraseSplit = phrases[i].replace(/ /g, '\u00a0\u00a0').split(reg);
			const phrase = new Array;
			for (let j = 0; j < phraseSplit.length; j++) {
				// console.log(`phraseSplit[${j}]`, phraseSplit[j]);
				if (phraseSplit[j][0] === '[') {
					// console.log("spinner!");
					// span it as a target!
					const cleanedPhraseSplit = phraseSplit[j].replace('[', '').replace(']', '');
					// console.log("cleanedPhraseSplit", cleanedPhraseSplit);
					nToSolve++;
					phrase.push(<span className={`target`} onClick={this.handlePartWordClick} key={`${id}-phraseSpan${i}-${j}`}>{cleanedPhraseSplit}</span>);
				}
				else if(phraseSplit[j].length){
					// console.log(`*phraseSplit[${j}]|${phraseSplit[j]}|`);
					phrase.push(<span onClick={this.handlePartWordError} key={`${id}-phraseSpan${i}-${j}`}>{phraseSplit[j]}</span>);
				}
			}

			// const soundFile = `src/sounds/${audio[i]}`;

			phraseList.push(
				<p>{ phrase }</p>
			);
		}

		const rows = new Array();
		for (let i = 0; i < phrases.length; i++){
			const phrase = phrases[i];
			const cells = new Array();
			if (phrase[0] === '') {
				// blank row
				rows.push(
					<tr className={`spacer`} key={`row${i}`}>
						<td colSpan={3}></td>
					</tr>
				);
			} else {
				// for (let j = 0; j < 2; j++) {
				cells.push(
					<td key={`row${i}cell1`}>
						{phraseList[i]}
					</td>
				);
				const soundFile = `src/sounds/${audio[i]}`;

				cells.push(
					<td key={`row${i}cell2`}>
						<AudioClip label={""} soundFile={soundFile} />
					</td>
				);

				rows.push(
					<tr key={`row${i}`}>
						{cells}
					</tr>
				);
			}
		}
		this.nToSolve = nToSolve;
		return (
			<div
				className={`word-parts-container container`}
				id={`${id ? id : ''}`}
				key={`${id}WordParts`}
			>
				<p className={`instructions`}>{instructionsText}</p>


				<div className='help'>
					{/* <label className={`hidden-help ${failCount >= 2 ? 'show' : ''}`}>{showHintsText}: <input type='checkbox' onChange={this.handleHints} /></label> */}
					<button className={`hidden-help ${failCount >= 2 ? 'show' : ''}`} onClick={this.autoSolve}>{cheatText}</button>&nbsp;
				</div>

				<table>
					<tbody>
						{rows}
					</tbody>
				</table>

				<p>{`${nPlaced} correct out of ${nToSolve}`}</p>
			</div>
		);
	};
}
