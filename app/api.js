// Import required libraries
const dotenv = require('dotenv');
dotenv.config();

// Set API URL and access token
const apiUrl = 'https://api-compass.speedcast.com/v1/services';
const accessToken = await fetchAccessToken();

// Helper function to get the access token
async function fetchAccessToken() {
	const url = 'https://api-compass.speedcast.com/v2.0/auth';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: process.env.COMPASS_API_USERNAME,
			password: process.env.COMPASS_API_PASSWORD,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		return data.access_token;
	} else {
		throw new Error(`Error: HTTP code ${response.status}`);
	}
}

// Function to fetch modem data for each company
async function fetchCompanyServices(provider, params, accessToken) {
	const url = getServiceURL(provider, params);

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
	});

	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(`Error: HTTP code ${response.status}`);
	}
}

// Function to fetch and handle services for all providers
async function fetchAllServices(accessToken) {
	const baseUrl = 'https://api-compass.speedcast.com/v2.0';
	const companyId = process.env.COMPASS_COMPANY_ID;
	const url = `${baseUrl}/company/${companyId}`;

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
	});

	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(`Error: HTTP code ${response.status}`);
	}
}

// Function to fetch modem details from the API
async function fetchModemDetails(url, accessToken) {
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
	});

	if (response.ok) {
		return await response.json();
	} else if (response.status === 401) {
		return { error: 'Unauthorized: Invalid API Key' };
	} else if (response.status === 404) {
		return { error: 'Modem not found' };
	} else {
		return { error: `Unexpected Error! (HTTP Code: ${response.status})` };
	}
}

// Function to fetch GPS data
async function fetchGPS(provider, ids, accessToken) {
	const cacheFile = 'status/cache/gps_cache.json';

	// Check if cache exists and is still valid (e.g., 5 minutes expiration)
	const cacheExists = await fetch(cacheFile).then((response) => response.ok);
	if (cacheExists && Date.now() - (await fetch(cacheFile).then((response) => response.headers.get('last-modified'))) < 300000) {
		return await fetch(cacheFile).then((response) => response.json());
	}

	// Proceed with API call
	const url = getGPSURL(provider);
	const postData = JSON.stringify({ ids });

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: postData,
	});

	if (response.ok) {
		// Save to cache
		await fetch(cacheFile, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: await response.json(),
		});
		return await response.json();
	} else if (response.status === 429) {
		console.log('Rate limit exceeded. Using cached data...');
		return await fetch(cacheFile).then((response) => response.json());
	} else {
		throw new Error(`Error: HTTP code ${response.status}`);
	}
}
