import React, { useEffect } from 'react';
import { Chart } from 'chart.js';

const UptimeChart = ({ uptimeTimestamp, uptimeValue }) => {
	useEffect(() => {
		const uptime = [
			{
				x: uptimeTimestamp,
				y: uptimeValue,
			},
		];

		const labels = uptimeTimestamp;
		const uptimeCtx = document.getElementById('uptimeChart').getContext('2d');
		const uptimeChart = new Chart(uptimeCtx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Uptime',
						data: uptime,
						borderColor: '#3986a8',
						borderWidth: 1,
						fill: false,
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		});

		return () => {
			uptimeChart.destroy();
		};
	}, [uptimeTimestamp, uptimeValue]);

	return (
		<div className='row py-4'>
			<div className='card rounded shadow'>
				<div className='card-body'>
					<h2 className='card-title h5'>Modem Uptime</h2>
					<canvas
						id='uptimeChart'
						width='400'
						height='100'
					></canvas>
				</div>
			</div>
		</div>
	);
};

export default UptimeChart;
