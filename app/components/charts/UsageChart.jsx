import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const UsageChart = ({ modemId, usageLabels, usagePriority, usageUnlimited }) => {
	useEffect(() => {
		const ctx = document.getElementById('usageChart').getContext('2d');
		const usageChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: usageLabels,
				datasets: [
					{
						label: 'Priority Usage',
						backgroundColor: '#5baed9',
						data: usagePriority,
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 0.05, // Set step size to 20 MB (0.02 GB)
							max: 1, // Set maximum value to 1 GB
						},
						title: {
							display: true,
							text: 'Usage (GB)',
						},
					},
				},
			},
		});

		return () => {
			usageChart.destroy();
		};
	}, [usageLabels, usagePriority, usageUnlimited]);

	return (
		<div className='row py-4'>
			<div className='card rounded shadow'>
				<div className='card-body'>
					<h2 className='card-title h5'>Service Line Usage ({modemId})</h2>
					<canvas
						id='usageChart'
						width='400'
						height='100'
					></canvas>
					<span>Data usage tracking is not immediate and may be delayed by 24 hours or more. Counting shown is for informational purposes only and final overages reflected in monthly invoice are accurate.</span>
				</div>
			</div>
		</div>
	);
};

export default UsageChart;
