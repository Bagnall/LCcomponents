// import { useState } from 'react'
import './App.scss';
import {
	Blanks,
	Congratulate,
	ErrorLog,
	Footer,
	Header,
	Jigsaw,
} from './Components';
import {
	handleResponse,
} from './utility';
import React from 'react';

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = ({
			dialogContent:'',
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
			errors,
			jigsaw1,
			jigsaw2,
			jigsaw3,
			phrases1,
			phrases2,
			phrases3,
			refreshErrorLog,
			showDialog = false,
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
					<div className="content">
						<h1>Fill in the blanks</h1>
						{phrases1 ? (
							<Blanks
								config={phrases1}
								logError={this.logError}
								showDialog={this.showDialog}
							/>
						) : null}
						<h1>Fill in the blanks</h1>
						{phrases2 ? (
							<Blanks
								config={phrases2}
								logError={this.logError}
								showDialog={this.showDialog}
							/>
						) : null}
						<h1>Complete the Jigsaw</h1>
						{jigsaw1 ? (
							<Jigsaw
								config={jigsaw1}
								logError={this.logError}
								showDialog={this.showDialog}
							/>
						) : null}
						<h1>Complete the Jigsaw</h1>
						{jigsaw2 ? (
							<Jigsaw
								config={jigsaw2}
								logError={this.logError}
								showDialog={this.showDialog}
							/>
						) : null}
						<h1>Complete the Jigsaw</h1>
						{jigsaw3 ? (
							<Jigsaw
								config={jigsaw3}
								logError={this.logError}
								showDialog={this.showDialog}
							/>
						) : null}
						<h1>Fill in the blanks</h1>
						{phrases3 ? (
							<Blanks
								config={phrases3}
								logError={this.logError}
								showDialog={this.showDialog}
							/>
						) : null}
					</div>
					<Footer />
				</div>

			</>
		);
	};
}

