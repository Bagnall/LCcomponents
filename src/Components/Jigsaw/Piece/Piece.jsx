import './Piece.scss';
import React from 'react';

export class Piece extends React.PureComponent {

	render = () => {

		const {
			className,
			correctImage,
			correctSet = false,
			correctx,
			correcty,
			handleMouseDown,
			handleMouseMove,
			handleMouseUp,
			incorrectImage,
			index,
			x,
			y
		} = this.props;

		const styles = {};
		if (x !== undefined) styles.left = `${x}px`;
		if (y !== undefined) styles.top = `${y}px`;
		if (correctSet) {
			styles.backgroundImage = `url(${correctImage})`;
		} else {
			styles.backgroundImage = `url(${incorrectImage})`;
		}

		// console.log("styles", styles);

		return (
			<div
				className={`piece ${correctSet ? 'correct-set' : ''} ${className ? className : ''} ${index}`}
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
