import './Word.scss';
import React from 'react';

export class Word extends React.PureComponent {

	render = () => {

		const {
			children,
			className,
			handleMouseDown,
			handleMouseMove,
			handleMouseUp,
			index,
			x,
			y,
		} = this.props;

		const styles = {};
		if (x !== undefined)styles.left = `${x}px`;
		if (y !== undefined)styles.top = `${y}px`;

		// word${index} must be the first class
		return (
			<span
				className={`word${index} word ${className ? className : ''} `}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onTouchStart={handleMouseDown}
				onTouchMove={handleMouseMove}
				onTouchEnd={handleMouseUp}
				style={styles}
			>{children}</span>
		);
	};
}
