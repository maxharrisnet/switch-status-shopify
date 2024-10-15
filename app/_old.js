// Env variables
// import dotenv from 'dotenv';
// dotenv.config();

const username = process.env.SHOPIFY_PUBLIC_COMPASS_API_USERNAME;
const password = process.env.SHOPIFY_PUBLIC_COMPASS_API_PASSWORD;
const compassCompany = process.env.SHOPIFY_PUBLIC_COMPASS_COMPANY_ID;

// Helper function to get the access token
async function fetchAccessToken() {
	console.log(process.env.SHOPIFY_PUBLIC_COMPASS_API_USERNAME);

	const url = 'https://api-compass.speedcast.com/v2.0/auth';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: username,
			password: password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		return data.access_token;
	} else {
		const errorText = await response.text();
		console.error(`Error: HTTP code ${response.status}, ${errorText}`);
		throw new Error(`Error: HTTP code ${response.status}`);
	}
}

const accessToken = await fetchAccessToken();

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
	const companyId = compassCompany;
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

export { fetchAccessToken, fetchCompanyServices, fetchAllServices, fetchModemDetails, fetchGPS };
