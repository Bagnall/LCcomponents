export let eventTarget = undefined;
export let eventComponent = undefined;
export let mouseDown = false;

export const mark = (x, y, colour = '#ff0000', text = '', node = document.getElementById('content')) => {
	const marker = document.createElement("div");
	if (text !== '') {
		text += `,${x}`;
		text += `,${y}`;
		const textNode = document.createTextNode(text);
		marker.appendChild(textNode);
	}
	marker.style.left = `${x}px`;
	marker.style.top = `${y}px`;
	marker.style.borderColor = `transparent transparent ${ colour } transparent`;
	marker.classList.add('marker');
	node.appendChild(marker);
};

export const mouseRelativeTo = (e, selector, scale = 1) => {
	// console.log("========== mouseRelativeTo selector", selector);
	let { pageX: x, pageY: y, target: node } = e;
	if (x === undefined) ({ pageX: x, pageY: y, target: node }=e.touches[0]);
	let id;
	let className;
	let datumFound = false;
	let dX = 0;
	let dY = 0;
	if (selector.includes('.')) className = selector.replace('.', '');
	if (selector.includes('#')) id = selector.replace('#', '');
	const scroll = window.scrollY;
	// Find the datum node
	while (!datumFound) {
		if ((className && node.classList.contains(className)) || (id && node.getAttribute('id') === id)){
			datumFound = true;
			// console.log("found");
			({ x: dX, y: dY } = node.getBoundingClientRect());
			x -= dX;
			y -= dY;
			y -= scroll;
		} else {
			// console.log("Step up");
			node = node.parentNode;
			if (node.getAttribute('id') === 'root') {
				// console.log("mouseRelativeTo failed to find target", selector);  
				return;
			}
		}
	}
	if (scale !== 1) {
		x /= scale;
		y /= scale;
	}
	return { x, y };
};

export const mouseCoords = (e) => {
	// console.log("mouseCoords");
	return pageMouseCoords(e); // { x, y };
};

export const pageMouseCoords = (e) => {
	// console.log("pageMouseCoords");
	const { pageX: x, pageY: y } = e;
	return { x, y };
};

export const offsetMouseCoords = (e) => {
	// console.log("offsetCoords");
	const { nativeEvent } = e;
	const { offsetX: x, offsetY: y } = nativeEvent;
	return { x, y };
};