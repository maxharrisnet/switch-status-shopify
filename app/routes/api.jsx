import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// API variables
const username = process.env.SHOPIFY_PUBLIC_COMPASS_API_USERNAME;
const password = process.env.SHOPIFY_PUBLIC_COMPASS_API_PASSWORD;
const compassCompany = process.env.SHOPIFY_PUBLIC_COMPASS_COMPANY_ID;
const apiEndpoint = 'https://api-compass.speedcast.com/v2.0';

let accessToken = null;

// Access Token
axios
	.post(`${apiEndpoint}/auth`, {
		username,
		password,
	})
	.then((response) => {
		const accessToken = response.data.access_token;
		console.log('Access token retrieved:', accessToken);
	})
	.catch((error) => {
		console.error('Error retrieving access token:', error);
	});

router.get('/get-access-token', (req, res) => {
	if (!accessToken) {
		return res.status(500).json({ message: 'Access token not available' });
	}
	res.json({ accessToken });
});

// API Key
router.get('/get-api-key', (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	res.json({ apiKey: process.env.SHOPIFY_API_KEY });
});

// Services Data
router.get('/services', async (req, res) => {
	try {
		const accessToken = req.headers.authorization;

		if (!accessToken) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const baseUrl = 'https://api-compass.speedcast.com/v2.0';
		const companyId = compassCompany;
		const url = `${baseUrl}/company/${companyId}`;

		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (response.ok) {
			const data = await response.json();
			res.json(data);
		} else {
			res.status(response.status).json({ message: 'Error fetching services' });
		}
	} catch (error) {
		console.error('Error fetching services:', error);
		res.status(500).json({ message: 'Error fetching services' });
	}
});

// Modem Details Data
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

// GPS Data
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

export default router;
