//Helper file that will contain helper functions that we will reuse many times accross the project:

//Importing the config file:
import { TIMEOUT_SEC } from "./config";

//Function responsible to returning a rejected promise after a number of seconds, we can use this in case the user has some trouble loading the recipes, so the fetch does not run forever;
function timeout(s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(new Error(`Request took too long! Timeout after ${s} second`));
		}, s * 1000);
	});
}

//One function to encapsulate the get and send JSON;
//Setting the uploadData with a default of undefined, for when we are only making a get request:
export async function AJAX(url, uploadData = undefined) {
	try {
		//So if the uploadData existis, setting the variable to be the sendJSON, otherwise to be the getJSON:
		const fetchPro = uploadData
			? fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(uploadData),
			  })
			: fetch(url);

		//Using promise.race here to check which promise will resolve faster, the loading fetch or the timeout that will reject after the seconds that were passed as arguments;
		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
		const data = await res.json();

		if (!res.ok) throw new Error(`${data.message} (${res.status})`);

		return data;
	} catch (error) {
		//Throwing the error again here, so we can handle it wherever we are calling this function, otherwise it would be a fulfilled promise even with the error;
		throw error;
	}
}

// export async function getJSON(url) {
// 	try {
// 	} catch (error) {}
// }

// export const sendJSON = async function (url, uploadData) {
// 	try {
// 		const fetchPro = fetch(url, {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify(uploadData),
// 		});

// 		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
// 		const data = await res.json();

// 		if (!res.ok) throw new Error(`${data.message} (${res.status})`);
// 		return data;
// 	} catch (err) {
// 		throw err;
// 	}
// };
