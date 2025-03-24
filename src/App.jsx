// import { useState } from 'react'
import './App.scss';
import {
	Accordion,
	AccordionArticle,
	Blanks,
	Congratulate,
	DropDowns,
	ErrorLog,
	Footer,
	Header,
	Jigsaw,
	PhraseTable,
	WordParts,
} from './Components';
import {
	handleResponse,
} from './utility';
import React from 'react';
import wof from './sounds/wheel-of-fortune.mp3';

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.wofAudio = new Audio(wof);

		this.state = ({
			dialogContent: '',
			errors: [],
			showDialog: false,
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

		fetch(`${window.location.origin}/src/config.json`, requestOptions)
			.then(handleResponse)
			.then(res => {
				this.setState(res);
			})
			.catch(error => {
				const action = `Retrieving configuration`;
				this.logError(action, error);
			});
	};

	hideDialog = () => {
		// console.log("hideDialog");
		this.setState({
			dialogContent:'',
			showDialog: false,
		});
	};

	logError = (action, ...params) => {
		// (action, statusCode, statusText, message) or
		// (action, error)
		const {
			errors,
			refreshErrorLog,
		} = this.state;
		if (params.length === 1) {
			// Is error object
			const [error] = params;
			const {
				detail,
				error_code: errorCode,
				error_message: errorMessage,
				message,
				status,
				statusText = '',
			} = error;
			let NebulaMessage = '';
			let NebulaStatus = '';
			if (errorCode && errorMessage) { // Most likely an error from Metabolism Server
				NebulaMessage += errorMessage;
				NebulaStatus += errorCode;
			}
			if (status) NebulaStatus = status;
			if (message) NebulaMessage += message;
			if (detail) NebulaMessage += detail;

			errors.push({
				action: action,
				message: NebulaMessage,
				statusCode: NebulaStatus,
				statusText: statusText,
			});

		} else {
			const [statusCode = '', statusText = '', message = ''] = params;

			errors.push({
				action: action,
				message: message,
				statusCode: statusCode,
				statusText: statusText,
			});
		}

		this.setState({
			errors: errors,
			refreshErrorLog: !refreshErrorLog,
			showSpinner: false,
		});
	};

	showDialog = (content) => {
		this.setState({
			dialogContent: content,
			showDialog: true,
		});
	};

	clearError = (index) => {
		const { errors } = this.state;
		errors.splice(index, 1);
		this.setState({
			errors: errors,
		});
	};

	clearLog = () => {
		this.setState({
			errors: [],
		});
	};

	render = () => {
		const {
			dialogContent,
			dropdowns1,
			errors,
			jigsaw1,
			jigsaw2,
			jigsaw3,
			monologues,
			phrases1,
			phrases2,
			phrases3,
			phraseTable1,
			refreshErrorLog,
			showDialog = false,
			vocabulary1,
			vocabulary2,
			wordparts1,
			wordsIntoSlots1,
			wordsIntoSlots2,
		} = this.state;

		return (
			<>
				<div className="app">
					<ErrorLog
						dialog={this.dialog}
						errors={errors}
						clearLog={this.clearLog}
						clearError={this.clearError}
						refreshErrorLog={refreshErrorLog}
					/>
					<Header />
					<Congratulate
						className={`${showDialog ? 'show' : ''}`}
						hideDialog={this.hideDialog}
						content={dialogContent}
					/>
					<div id="content">
						<Accordion>
							{dropdowns1 ? (
								<AccordionArticle
									id={`DropDowns1Accordion`}
									title={`Select the Correct Adjective of Nationality`}
								>
									<DropDowns
										config={dropdowns1}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>
							) : null}
							{wordparts1 ? (
								<AccordionArticle
									id={`AccordionWordParts1Accordion`}
									title={`Select the parts of the words with the described sounds`}
								>
									<WordParts
										config={wordparts1}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>
							) : null}
							{wordsIntoSlots2 ? (
								<AccordionArticle
									id={`AccordionWordsIntoSlots2Accordion`}
									title={`Match the Answers to the Questions`}
								>
									<Blanks
										config={wordsIntoSlots2}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>

							) : null}
							{wordsIntoSlots1 ? (
								<AccordionArticle
									id={`AccordionWordsIntoSlots1Accordion`}
									title={`Put the words in the Order You Hear Them`}
								>
									<Blanks
										config={wordsIntoSlots1}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>

							) : null}
							{phraseTable1 ? (
								<>
									<AccordionArticle
										id={`accordionPhraseTable1Accordion`}
										title={`Dialogues`}
									>
										<PhraseTable
											config={phraseTable1}
											logError={this.logError}
											showDialog={this.showDialog}
										/>
									</AccordionArticle>
								</>
							) : null}
							{vocabulary1 ? (
								<AccordionArticle
									id={`Vocabulary1Accordion`}
									title={`Vocabulary`}
								>
									<PhraseTable
										config={vocabulary1}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>
							) : null}
							{monologues ? (
								<AccordionArticle
									id={`MonologuesAccordion`}
									title={`Monologues`}
								>
									<PhraseTable
										config={monologues}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>
							) : null}
							{vocabulary2 ? (
								<AccordionArticle
									id={`Vocabulary2Accordion`}
									title={`Vocabulary`}
								>
									<PhraseTable
										config={vocabulary2}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>
							) : null}
							{phrases1 ? (
								<AccordionArticle
									id={`Phrases1Accordion`}
									title={`Fill in the Blanks`}
								>
									<Blanks
										config={phrases1}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>
							) : null}
							{phrases2 ? (
								<AccordionArticle
									id={`Phrases2Accordion`}
									title={`Fill in the Blanks`}
								>
									<Blanks
										config={phrases2}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>
							) : null}
							{jigsaw1 ? (
								<AccordionArticle
									id={`Jigsaw1Accordion`}
									title={`Complete the Jigsaw`}
								>
									<Jigsaw
										config={jigsaw1}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>
							) : null}
							{jigsaw2 ? (
								<AccordionArticle
									id={`Jigsaw2Accordion`}
									title={`Complete the Jigsaw`}
								>
									<Jigsaw
										config={jigsaw2}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>
							) : null}
							{jigsaw3 ? (
								<AccordionArticle
									id={`Jigsaw3Accordion`}
									title={`Complete the Jigsaw`}
								>
									<Jigsaw
										config={jigsaw3}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>
							) : null}
							{phrases3 ? (
								<AccordionArticle
									id={`phrases3Accordion`}
									title={`Fill in the blanks`}
								>
									<Blanks
										config={phrases3}
										logError={this.logError}
										showDialog={this.showDialog}
									/>
								</AccordionArticle>
							) : null}
						</Accordion>
					</div>
					<Footer />
				</div>

			</>
		);
	};
}

