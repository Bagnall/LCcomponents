import './Accordion.scss';
import React from 'react';

export class Accordion extends React.PureComponent {

	render() {
		const {
			children,
			className = '',
			id = '',
		} = this.props;

		return (
			<div
				className={`accordion ${className}`}
				id={`${id}`}
			>
				{children}
			</div>
		);
	}
}