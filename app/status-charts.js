import { fetchModemDetails, fetchGPS } from './api.js';
import { getServiceURL, filterTimestamps } from './helpers.js';

async function getModemData(provider, modemId, accessToken) {
	if (!modemId || !provider) {
		throw new Error('Both modemId and provider parameters are required.');
	}

	if (typeof accessToken === 'string' && accessToken.startsWith('Error')) {
		throw new Error(accessToken);
	}

	const modemDetailsURL = getServiceURL(provider, modemId);
	const modem = await fetchModemDetails(modemDetailsURL, accessToken);

	if (typeof modem === 'string' && modem.startsWith('Error')) {
		throw new Error(modem);
	} else if (!modem) {
		throw new Error(`No data available for modem ${modemId}`);
	}

	const gps = await fetchGPS(provider, [modemId], accessToken);

	const latencyData = modem.data.latency.data || [];
	const throughputData = modem.data.throughput.data || [];
	const signalQualityData = modem.data.signal.data || [];
	const obstructionData = modem.data.obstruction.data || [];
	const usageData = modem.usage || [];
	const uptimeData = modem.data.uptime.data || [];

	const latencyTimestamps = latencyData.map((entry) => new Date(entry[0] * 1000).toTimeString().slice(0, 5));
	const latencyValues = latencyData.map((entry) => entry[1]);

	const signalTimestamps = signalQualityData.map((entry) => filterTimestamps(entry[0], 2)).filter(Boolean);
	const signalValues = signalQualityData.map((entry) => entry[1]);

	const throughputTimestamps = throughputData.map((entry) => new Date(entry[0] * 1000).toTimeString().slice(0, 5));
	const throughputDownload = throughputData.map((entry) => entry[1]);
	const throughputUpload = throughputData.map((entry) => entry[2]);

	const usageLabels = usageData.slice(-7).map((day) => new Date(day.date).toDateString().slice(4, 10));
	const usagePriority = usageData.slice(-7).map((day) => day.priority || 0);
	const usageUnlimited = usageData.slice(-7).map((day) => day.unlimited || 0);

	const uptime = uptimeData.length ? uptimeData[uptimeData.length - 1] : null;
	const uptimeTimestamp = uptime ? new Date(uptime[0] * 1000).toDateString() + ' ' + new Date(uptime[0] * 1000).toTimeString().slice(0, 5) : null;
	const uptimeValue = uptime ? uptime[1] : null;

	return {
		latencyTimestamps,
		latencyValues,
		signalTimestamps,
		signalValues,
		throughputTimestamps,
		throughputDownload,
		throughputUpload,
		usageLabels,
		usagePriority,
		usageUnlimited,
		obstructionData,
		uptimeTimestamp,
		uptimeValue,
	};
}
