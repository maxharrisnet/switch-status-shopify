// routes/api.js
import express from 'express';
const router = express.Router();
import axios from 'axios';

// const username = process.env.SHOPIFY_PUBLIC_COMPASS_API_USERNAME;
// const password = process.env.SHOPIFY_PUBLIC_COMPASS_API_PASSWORD;
// const compassCompany = process.env.SHOPIFY_PUBLIC_COMPASS_COMPANY_ID;
// console.log(compassCompany);
const apiEndpoint = 'https://api-compass.speedcast.com/v2.0';

// Access Token
axios
	.post(`${apiEndpoint}/auth`, {
		username,
		password,
	})
	.then((response) => {
		const accessToken = response.data.access_token;
		// Use the access token to authenticate subsequent requests
	})
	.catch((error) => {
		console.error(error);
	});

// Define your API endpoints
router.get(`${apiEndpoint}/modem-details/:provider/:modemId`, async (req, res) => {
	try {
		const provider = req.params.provider;
		const modemId = req.params.modemId;
		const accessToken = req.headers.authorization;

		if (!modemId || !provider) {
			throw new Error('Both modemId and provider parameters are required.');
		}

		// Call your API function to fetch modem details
		const modemDetailsURL = getServiceURL(provider, modemId);
		const modem = await fetchModemDetails(modemDetailsURL, accessToken);

		res.json(modem);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching modem details' });
	}
});

router.get(`${apiEndpoint}/gps/:provider/:modemId`, async (req, res) => {
	try {
		const provider = req.params.provider;
		const modemId = req.params.modemId;
		const accessToken = req.headers.authorization;

		if (!modemId || !provider) {
			throw new Error('Both modemId and provider parameters are required.');
		}

		// Call your API function to fetch GPS data
		const gps = await fetchGPS(provider, [modemId], accessToken);

		res.json(gps);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching GPS data' });
	}
});

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
