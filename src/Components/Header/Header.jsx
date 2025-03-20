import './Header.scss';
import React from 'react';

export class Header extends React.PureComponent {

	render = () => {
		return (
			<header className={`main-header`}>
				<h1>Cambridge University Language Centre Technical Test</h1>
				<h2>Richard Bagnall</h2>
			</header>
		);
	};
}

