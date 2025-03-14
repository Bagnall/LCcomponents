export const initialViewOffset = 24; // To reveal edge of card table

export const addNonDuplicateHeaders = (dataSet, headers) => {

	const flatHeaders = dataSet.headers.map((header) => JSON.stringify(header));
	// console.log("flatHeaders", flatHeaders);
	headers.forEach((header) => {
		const flatHeader = JSON.stringify(header);
		const foundIndex = flatHeaders.indexOf(flatHeader);
		if(foundIndex === -1)dataSet.headers.push(header);
	});
};

export const appendScript = (scriptToAppend, DOMnode, callback) => {
	const script = document.createElement("script");
	script.type = 'text/javascript';
	script.async = true;
	script.src = scriptToAppend;
	DOMnode.appendChild(script);
	script.onload = () => callback;
};

export const clearCanvas = (canvas) => {
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
};

export const base64ToBlob = (base64String, contentType = '') => {
	const byteCharacters = atob(base64String);
	const byteArrays = [];

	for (let i = 0; i < byteCharacters.length; i++) {
		byteArrays.push(byteCharacters.charCodeAt(i));
	}

	const byteArray = new Uint8Array(byteArrays);
	return new Blob([byteArray], { type: contentType });
};

export const arrayIncludesObject = (seeking, arrayToSearch) => {

	// For an array of objects, checks if it includes the object in question
	return arrayToSearch.some(element => {
		return JSON.stringify(seeking) == JSON.stringify(element);
	});
};

export const copyObject = (originalObject) => {
	if (originalObject) return JSON.parse(JSON.stringify(originalObject)); // If you know of a better solution, please enlighten me.
	return;
};

export const getCardById = (id, dataSet) => {
	// Note - card - any card including stacked card or 'stack'
	const { rows: molecules = [], stacks = [] } = dataSet;
	const stack = stacks.find(item => {
		return item.id === ''+id;  
	});
	if (stack) return stack;
	const molecule = molecules.find(item => {
		return item.id === ''+id;  
	});
	return molecule;
};

export const getHighAndLow = (s1, s2) => {
	if (s1 < s2) return { high: s2, low: s1 };
	return { high: s1, low: s2 };
};

export const getMoleculeById = (id, dataSet) => {
	// Molecules only, no stacks
	// const { dataSets, currentDataSet } = this.state;
	// const dataSet = dataSets[currentDataSet];
	const { rows } = dataSet;
	return rows.find(item => {
		return item.id === id;
	});
};

export const getStackSelectedCount = (stack, molecules) => {
	let nMolecules = 0;
	let nSelected = 0;
	const { molecules: stackMolecules } = stack;
	stackMolecules.map((moleculeId) => {
		const { 0: m } = molecules.filter(item => moleculeId === item.id);
		if (m) {
			nMolecules++;
			if (m.selected) nSelected++;
		}
		return false;
	});
	return 100 * nSelected / nMolecules;
};

export const handleResponse = (response) => {
	// Used in all API calls
	if (response.status === 204) return Promise.resolve(true);
	return response.json()
		.then((json) => {
			if (!response.ok) {
				const error = {
					...json,
					...{
						message: json.message,
						status: response.status,
						statusText: response.statusText,
					}
				};
				return Promise.reject(error);
			}
			return json;
		});
};

export const handleResponseText = (response) => {
	// Used in all API calls
	if (response.status === 204) return Promise.resolve(true);
	return response.text()
		.then((res) => {
			if (!response.ok) {
				const error = {
					...res,
					...{
						message: res.message,
						status: response.status,
						statusText: response.statusText,
					}
				};
				return Promise.reject(error);
			}
			return res;
		});
};


export const handleResponseCSV = (response) => {
	// Used in all CSV API calls
	if (response.status === 204 /* || response.status === 200 */) return Promise.resolve(true);
	return response.text()
		.then((text) => {
			let error = '';
			if (response.status === 404) {
				error = {message: "Sorry, file is unavailable at this time"};
				return Promise.reject(error);
			}
			if (!response.ok) {
				if (typeof (text) === 'string') {
					try {
						error = JSON.parse(text);
					}
					catch {
						error = {message: text};
					}
					return Promise.reject(error);
				} else {
					error = {
						...text,
						...{
							message: text.message,
							status: response.status,
							statusText: response.statusText,
						}
					};
					return Promise.reject(error);
				}
			}
			return text;
		});
};

export const isAlphaNumeric = (str) => { // Within the rules for datasets
	let code, i, len;

	for (i = 0, len = str.length; i < len; i++) {
		code = str.charCodeAt(i);
		if (
			!(code > 47 && code < 58) && // numeric (0-9)
			!(code > 64 && code < 91) && // upper alpha (A-Z)
			!(code > 96 && code < 123) &&// lower alpha (a-z)
			!(code === 95 || code === 45)
		) {
			return false;
		}
	}
	return true;
};

export const titleCase = (str) => {
	const splitStr = str.toLowerCase().split(' ');
	for (let i = 0; i < splitStr.length; i++) {
		// You do not need to check if i is larger than splitStr length, as your for does that for you
		// Assign it back to the array
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	// Directly return the joined string
	return splitStr.join(' ');
};

export const uuidv4 = () => {
	console.trace('uuidv4');
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> c) / 4)).toString(16)
	);
};
