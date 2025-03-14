// import { useState } from 'react'
import './App.scss';
import {
	Congratulate,
	Footer,
	Header,
	Jigsaw,
	Piece ,
} from './Components';
import React from 'react';

export default class App extends React.Component {

	constructor(props) {
		super(props)
		this.state = ({
			dialogContent:'',
			showDialog: false,
		})
	}

	hideDialog = () => {
		console.log("hideDialog");
		this.setState({
			dialogContent:'',
			showDialog: false,
		})
	}

	showDialog = (content) => {
		this.setState({
			dialogContent: content,
			showDialog: true,
		})
		
	}

	render = () => {
		const {
			dialogContent,
			showDialog = false,
		} = this.state;

		return (
			<>
				<div className="app">
					<Header />
					<Congratulate
						className={`${showDialog ? 'show' : ''}`}
						hideDialog={this.hideDialog}
						content={dialogContent}
					/>
					<div className="content">
						<Jigsaw showDialog={this.showDialog} />
					</div>
					<Footer />
				</div>

			</>
		);
	};
}

