import './Info.scss';
import React from 'react';

export class Info extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			showInfo: false,
		};

	}

	render() {

		const {
			infoTitle,
			infoMessage,
		} = this.props;

		const {
			showInfo = false,
		} = this.state;

		return (
			<>
				<button
					alt='i'
					className={`button-info`}
					onClick={() => this.setState({ showInfo: true })}
					title={'More information'}
				>i</button>
				<div
					className={`${showInfo ? 'show' : ''}`}
					id='info'
				>
					<header>
						< button
							title="Close"
							onClick={() => { this.setState({ showInfo: false }); }}
							className='window-close' >
						</button >
					</header>
					<div className='background' />
					<div className={`for-scrolling`}>
						<h1>{infoTitle}</h1>
						{infoMessage}
					</div>

				</div>
			</>
		);
	}
}