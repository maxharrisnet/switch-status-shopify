// PROBABLY MOVE THESE TO THE COMPONENTS
// Define your getServiceURL function
function getServiceURL(provider, modemId) {
	// Implement your getServiceURL logic here
	return `${apiEndpoint}/${provider}/${modemId}`;
}

// Define your fetchModemDetails function
async function fetchModemDetails(modemDetailsURL, accessToken) {
	// Implement your fetchModemDetails logic here
	// For example, using the axios library:
	const axios = require('axios');
	const response = await axios.get(modemDetailsURL, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return response.data;
}

// Define your fetchGPS function
async function fetchGPS(provider, modemIds, accessToken) {
	// Implement your fetchGPS logic here
	// For example, using the axios library:
	const axios = require('axios');
	const response = await axios.get(`${apiEndpoint}/starlinkgps`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		params: {
			modemIds: modemIds.join(','),
		},
	});
	return response.data;
}

export default router;
