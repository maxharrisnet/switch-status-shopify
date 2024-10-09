import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SignalQualityChart = ({ signalTimestamps, signalValues }) => {
	const chartRef = useRef(null);

	useEffect(() => {
		const signalCtx = chartRef.current.getContext('2d');
		new Chart(signalCtx, {
			type: 'line',
			data: {
				labels: signalTimestamps,
				datasets: [
					{
						label: 'Signal Quality (%)',
						data: signalValues,
						borderCapStyle: 'round',
						borderColor: '#3986a8', // Darker border color
						borderWidth: 1,
						pointRadius: 0, // Remove dots at each point
						fill: {
							target: 'origin',
							above: '#8bcff0', // Lighter fill color
							below: '#8bcff0', // And blue below the origin
						},
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							callback: function (value) {
								return value + '%'; // Add percentage sign to y-axis labels
							},
							stepSize: 50, // Set step size to 50
							max: 100, // Set maximum value to 100
						},
					},
				},
			},
		});
	}, [signalTimestamps, signalValues]);

	return (
		<div className='row py-4'>
			<div className='card rounded shadow'>
				<div className='card-body'>
					<h2 className='card-title h5'>Signal Quality</h2>
					<canvas
						id='signalQualityChart'
						ref={chartRef}
						width='400'
						height='100'
					></canvas>
				</div>
			</div>
		</div>
	);
};

export default SignalQualityChart;
