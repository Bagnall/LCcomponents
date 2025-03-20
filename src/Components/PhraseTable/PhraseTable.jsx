import './PhraseTable.scss';
import {
	AudioClip,
} from '../../Components';
import React from 'react';

export class PhraseTable extends React.PureComponent {

	// Table of phrases with translatiopns column and sound files column.
	// config is passed from the parent so that multiple exercises are possible.

	constructor(props) {
		super(props);
		this.state = ({
			...props.config
		});
	}

	render = () => {
		const {
			id = [],
			phrases,
		} = this.state;
		// const { id = '' } = config;
		const rows = new Array();
		for (let i = 0; i < phrases.length; i++){
			const phrase = phrases[i];
			const cells = new Array();
			if (phrase[0] === '') {
				// blank row
				rows.push(
					<tr className={`spacer`} key={`row${i}`}>
						<td colSpan={3}></td>
					</tr>
				);
			} else {
				for (let j = 0; j < 2; j++) {
					cells.push(
						<td key={`row${i}cell${j}`}>
							{phrase[j]}
						</td>
					);
				}
				if (phrase[2]) {
					cells.push(
						<td key={`row${i}cell${3}`}>
							<AudioClip label={""} soundFile={phrase[2]} />
						</td>
					);
				}

				rows.push(
					<tr key={`row${i}`}>
						{cells}
					</tr>
				);
			}
		}

		return (
			<div
				className={`phrases-table-container container`}
				id={`${id ? id : ''}`}
			>
				<table>
					<tbody>
						{rows}
					</tbody>
				</table>
			</div>
		);
	};
}
