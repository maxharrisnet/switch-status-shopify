import React, { useEffect } from 'react';
import { Chart } from 'chart.js';

const ObstructionChart = ({ obstructionData }) => {
	useEffect(() => {
		// Convert timestamps to readable dates for x-axis labels
		const labels = obstructionData.map((entry) => {
			const date = new Date(entry[0] * 1000);
			return date.toISOString().slice(0, 16).replace('T', ' ');
		});

		// Extract obstruction percentages for y-axis data
		const dataPoints = obstructionData.map((entry) => entry[1]);

		const obstructionCtx = document.getElementById('obstructionChart').getContext('2d');
		new Chart(obstructionCtx, {
			type: 'line',
			data: {
				labels: labels, // Dates for x-axis
				datasets: [
					{
						label: 'Obstruction (%)',
						data: dataPoints, // Obstruction percentages for y-axis
						backgroundColor: '#8bcff0',
						borderColor: '#3986a8',
						borderCapStyle: 'round',
						borderWidth: 1,
						pointRadius: 0, // Remove dots at each point
						fill: true,
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Obstruction (%)',
						},
					},
					x: {
						title: {
							display: true,
							text: 'Date/Time',
						},
					},
				},
			},
		});
	}, [obstructionData]);

	return (
		<div className='row py-4'>
			<div className='card rounded shadow'>
				<div className='card-body'>
					<h2 className='card-title h5'>Obstruction</h2>
					<canvas
						id='obstructionChart'
						width='400'
						height='100'
					></canvas>
				</div>
			</div>
		</div>
	);
};

export default ObstructionChart;
