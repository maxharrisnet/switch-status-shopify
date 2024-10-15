import { PassThrough } from 'stream';
import { renderToPipeableStream } from 'react-dom/server';
import { RemixServer } from '@remix-run/react';
import { createReadableStreamFromReadable } from '@remix-run/node';
import { isbot } from 'isbot';
import { addDocumentResponseHeaders } from './shopify.server';
import axios from 'axios';
import express from 'express';

const router = express.Router();
const ABORT_DELAY = 5000;
const username = process.env.SHOPIFY_PUBLIC_COMPASS_API_USERNAME;
const password = process.env.SHOPIFY_PUBLIC_COMPASS_API_PASSWORD;
const compassCompany = process.env.SHOPIFY_PUBLIC_COMPASS_COMPANY_ID;
const apiEndpoint = 'https://api-compass.speedcast.com/v2.0';

let accessToken = null;

// Remix code
export default async function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
	addDocumentResponseHeaders(request, responseHeaders);
	const userAgent = request.headers.get('user-agent');
	const callbackName = isbot(userAgent ?? '') ? 'onAllReady' : 'onShellReady';

	return new Promise((resolve, reject) => {
		const { pipe, abort } = renderToPipeableStream(
			<RemixServer
				context={remixContext}
				url={request.url}
				abortDelay={ABORT_DELAY}
			/>,
			{
				[callbackName]: () => {
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set('Content-Type', 'text/html');
					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						})
					);
					pipe(body);
				},
				onShellError(error) {
					reject(error);
				},
				onError(error) {
					responseStatusCode = 500;
					console.error(error);
				},
			}
		);

		setTimeout(abort, ABORT_DELAY);
	});
}

// Custom code

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
