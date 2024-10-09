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
