const ModemCard = ({ modem, service }) => {
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
						</div>
					</div>
				</div>
			</a>
		</div>
	);
};

export default ModemCard;
