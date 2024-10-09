// Function to construct service URL based on provider
function getServiceURL(provider, sysId) {
	const baseUrl = 'https://api-compass.speedcast.com/v2.0';

	switch (provider) {
		case 'starlink':
			return `${baseUrl}/starlink/${sysId}`;
		case 'idirect':
			return `${baseUrl}/idirectmodem/${sysId}`;
		case 'newtec':
			return `${baseUrl}/newtecmodem/${sysId}`;
		case 'oneweb':
			return `${baseUrl}/oneweb/${sysId}`; // TODO: Test, fix with terminalId (see docs)
		default:
			return null;
	}
}

// Function to construct GPS URL based on provider
function getGPSURL(provider) {
	const baseUrl = 'https://api-compass.speedcast.com/v2.0';

	switch (provider) {
		case 'starlink':
			return `${baseUrl}/starlinkgps`;
		case 'idirect':
			return `${baseUrl}/idirectgps`;
		case 'newtec':
			return `${baseUrl}/newtecgps`;
		case 'oneweb':
			return `${baseUrl}/oneweb`; // TODO: Test, fix with terminalId (see docs)
		default:
			return null;
	}
}

// Function to filter timestamps
function filterTimestamps(timestamp, hourIncrement) {
	const hours = new Date(timestamp).getHours();
	const minutes = new Date(timestamp).getMinutes();

	if (minutes === 0 && hours % 2 === 0) {
		return new Date(timestamp).toLocaleTimeString();
	}
	return null;
}

// Function to get latency class
function getLatencyClass(latency) {
	// Returns the class based on latency value
	if (latency < 50) return 'latency-green';
	else if (latency < 150) return 'latency-orange';
	else return 'latency-red';
}
