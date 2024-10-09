// import { modemDetails }

const ModemCard = ({ modem, service, modemDetails }) => {
	const getLatencyClass = (latencyValue) => {
		// Define your logic to determine the class based on latency value
		if (latencyValue < 50) return 'low-latency';
		if (latencyValue < 100) return 'medium-latency';
		return 'high-latency';
	};

	return (
		<div className='row p-2'>
			<a
				href={`http://localhost/switch/service_status_detail.php?provider=${modem.type.toLowerCase()}&modemid=${modem.id}`}
				className='text-black text-decoration-none fw-bold'
			>
				<div
					className='card modem-card shadow-sm mb-0'
					onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
					onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '')}
				>
					<div className='card-body'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='w-25'>
								<h3 className='card-title fs-6'>{modem.name}</h3>
								<h4 className='card-subtitle h6 font-weight-bolder text-secondary'>{service.name}</h4>
							</div>
							{modemDetails?.data?.latency?.data && modemDetails.data.latency.data.length > 0 ? (
								<div
									className='latency-bar-24h d-flex rounded w-75'
									style={{ height: '50px' }}
								>
									{modemDetails.data.latency.data.map((latencyPoint, index) => {
										const latencyValue = latencyPoint[1];
										const latencyClass = getLatencyClass(latencyValue);
										const segmentWidth = (10 / 1440) * 100; // Adjust the width based on your data frequency

										return (
											<div
												key={index}
												className={`latency-segment ${latencyClass}`}
												style={{ width: `${segmentWidth}%` }}
											></div>
										);
									})}
								</div>
							) : (
								<div className='w-75 flex justify-center align-center p-2'>
									<p className='mb-0'>No data available</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</a>
		</div>
	);
};

export default ModemCard;
