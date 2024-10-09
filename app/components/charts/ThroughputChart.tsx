import React from 'react';
import { Chart } from 'chart.js';

const ThroughputChart = ({ throughputTimestamps, throughputDownload, throughputUpload }) => {
	React.useEffect(() => {
		const throughputCtx = document.getElementById('throughputChart').getContext('2d');
		new Chart(throughputCtx, {
			type: 'line',
			data: {
				labels: throughputTimestamps,
				datasets: [
					{
						label: 'Download Throughput (Mbps)',
						data: throughputDownload,
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
					{
						label: 'Upload Throughput (Mbps)',
						data: throughputUpload,
						borderColor: '#c5522b',
						borderCapStyle: 'round',
						borderWidth: 1,
						pointRadius: 0, // Remove dots at each point
						fill: {
							target: 'origin',
							above: '#f69263', // Lighter fill color
							below: '#f69263', // And blue below the origin
						},
					},
				],
			},
			options: {
				transitions: {
					show: {
						animations: {
							x: {
								from: 0,
							},
						},
					},
					hide: {
						animations: {
							x: {
								to: 0,
							},
						},
					},
				},
			},
		});
	}, [throughputTimestamps, throughputDownload, throughputUpload]);

	return (
		<div className='row py-4'>
			<div className='card rounded shadow'>
				<div className='card-body'>
					<h2 className='card-title h5'>Throughput</h2>
					<canvas
						id='throughputChart'
						width='400'
						height='100'
					></canvas>
				</div>
			</div>
		</div>
	);
};

export default ThroughputChart;
