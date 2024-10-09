import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const LatencyChart = ({ latencyTimestamps, latencyValues }) => {
	useEffect(() => {
		const latencyCtx = document.getElementById('latencyChart').getContext('2d');
		new Chart(latencyCtx, {
			type: 'line',
			data: {
				labels: latencyTimestamps,
				datasets: [
					{
						label: 'Latency (ms)',
						data: latencyValues,
						borderCapStyle: 'round',
						borderColor: '#3986a8', // Darker border color
						borderWidth: 1,
						pointRadius: 0, // Remove dots at each point
						fill: {
							target: 'origin',
							above: '#8bcff0', // Lighter fill color
							below: '#5baed9', // And blue below the origin
						},
					},
				],
			},
		});
	}, [latencyTimestamps, latencyValues]);

	return (
		<div className='row py-4'>
			<div className='card rounded shadow'>
				<div className='card-body'>
					<h2 className='card-title h5'>Latency</h2>
					<canvas
						id='latencyChart'
						width='400'
						height='100'
					></canvas>
				</div>
			</div>
		</div>
	);
};

export default LatencyChart;
