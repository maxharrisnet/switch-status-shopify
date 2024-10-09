import React, { useEffect, useState } from 'react';
import { getModemData } from './status-charts';
import LatencyChart from './LatencyChart';
import SignalQualityChart from './SignalQualityChart';
// Import other chart components

const Dashboard = ({ provider, modemId, accessToken }) => {
	const [modemData, setModemData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getModemData(provider, modemId, accessToken);
				setModemData(data);
			} catch (err) {
				setError(err.message);
			}
		};

		fetchData();
	}, [provider, modemId, accessToken]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!modemData) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<LatencyChart
				data={modemData.latencyValues}
				timestamps={modemData.latencyTimestamps}
			/>
			<SignalQualityChart
				data={modemData.signalValues}
				timestamps={modemData.signalTimestamps}
			/>
			{/* Pass data to other chart components */}
		</div>
	);
};

export default Dashboard;
