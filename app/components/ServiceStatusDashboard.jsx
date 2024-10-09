import React, { useEffect, useState } from 'react';
import { fetchAllServices } from '../api';
import ModemCard from './ModemCard';

const ServiceStatusDashboard = () => {
	const [services, setServices] = useState([]);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const data = await fetchAllServices();
				setServices(data);
			} catch (error) {
				console.error('Error fetching services:', error);
			}
		};

		fetchServices();
	}, []);

	return (
		<section>
			{services.map((service) => (
				<ModemCard
					key={service.id}
					service={service}
				/>
			))}
		</section>
	);
};

export default ServiceStatusDashboard;
