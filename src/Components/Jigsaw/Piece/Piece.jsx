import './Piece.scss';
import React from 'react';

export class Piece extends React.PureComponent {

	render = () => {

		const {
			correctSet = false,
			correctx,
			correcty,
			handleMouseDown,
			handleMouseMove,
			handleMouseUp,
			index,
			x,
			y
		} = this.props;

		const styles = {}
		if ( x!= undefined)styles.left = `${x}px`;
		if ( y!= undefined)styles.top = `${y}px`;

		return (
			<div
				className={`piece ${correctSet ? 'correct-set' : ''} ${index}`}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onTouchStart={handleMouseDown}
				onTouchMove={handleMouseMove}
				onTouchEnd={handleMouseUp}
				style={styles}
				correctx={correctx}
				correcty={correcty}
			></div>
		);
	};
}
