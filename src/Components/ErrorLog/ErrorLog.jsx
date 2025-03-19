import './ErrorLog.scss';
import React from 'react';

export class ErrorLog extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			collapse: false,
		};

		this.copyErrors = this.copyErrors.bind(this);
		this.expand = this.expand.bind(this);
		this.toggleCollapseLog = this.toggleCollapseLog.bind(this);
	}

	copyErrors = () => {
		const {
			dialog,
			errors = [],
		} = this.props;

		let errorList = '';
		errors.forEach((error, index) => {
			const {
				action,
				message,
				statusCode,
				statusText,
			} = error;
			errorList += `${action}\t${message}\t${statusCode}\t${statusText}\n`;
		});

		this.copyTextToClipboard(errorList)
			.then(() => {
				dialog("Error log copied to clipboard");
			})
			.catch ((error) => {
				console.log("Copy to clipboard", error); // eslint-disable-line
			});
	};

	copyTextToClipboard = (text) => {
		return new Promise(function (resolve, reject) {
			const isApiSupported = !!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
			if (isApiSupported) {
				navigator.clipboard.writeText(text).then(function () {
					return resolve();
				}, function (e) {
					return reject(e);
				});
			} else {
				reject('Clipboard API is not supported');
			}
		});
	};

	expand = () => {
		const tableContainer = document.getElementById('tableContainer');
		if (tableContainer) {
			tableContainer.scrollTo({
				behavior: 'smooth',
				top: tableContainer.scrollHeight,
			});
			this.setState({
				collapse: false,
			});
		}
	};

	componentDidUpdate = (oldProps) => {
		const { refreshErrorLog: oldRefreshErrorLog } = oldProps;
		const { refreshErrorLog } = this.props;
		if (refreshErrorLog !== oldRefreshErrorLog) this.expand();
	};

	toggleCollapseLog = () => {
		const { collapse } = this.state;

		this.setState({
			collapse: !collapse
		});
	};

	render() {
		const {
			errors = [],
			clearLog,
			clearError,
		} = this.props;

		const {
			collapse,
		} = this.state;

		const rows = [];
		errors.forEach((error, index) => {
			const {
				action,
				message,
				statusCode,
				statusText,
			} = error;
			rows.push(
				<tr key={`errorLogRow${index}`}>
					<td key={`errorLogCell${index}-0`}>{action}</td>
					<td key={`errorLogCell${index}-1`}>{message}</td>
					<td key={`errorLogCell${index}-2`}>{statusCode}</td>
					<td key={`errorLogCell${index}-3`}>{statusText}</td>
					<td
						className='button'
						key={`errorLogCell${index}-4`}>
						<button
							className='dismiss clear-error'
							title='Dismiss error'
							onClick={(e) => { clearError(index); }}
						>X</button></td>
				</tr >
			);
		});

		return (
			<div id='errorLog' className={`${errors.length > 0 ? 'show' : ''} ${collapse ? 'collapse' : ''}`}>
				<header>
					Error Log
					<div className='header-buttons-left'>
						<button
							id='collapse'
							className='collapse-log'
							title={`${collapse ? 'Maximise' : 'Minimise'} log`}
							onClick={this.toggleCollapseLog}
						></button>
					</div>
					<div className='header-buttons-right'>
						<button
							id='copyAll'
							className='copy-errors'
							title='Copy log to clipboard'
							onClick={this.copyErrors}
						></button>
						<button
							id='clearAll'
							className='clear-error'
							title='Dismiss all'
							onClick={clearLog}
						>X</button>
					</div>
				</header>
				<div id='tableContainer'>
					<table>
						<tbody>
							{rows}
						</tbody>
					</table>
				</div>
			</div>
		);
	};
}