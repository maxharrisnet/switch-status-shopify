import React, { useEffect, useState } from 'react';
import { fetchAllServices } from '../api';
import ModemCard from '../components/ModemCard';

const ServiceStatusDashboard = () => {
	const [services, setServices] = useState([]);
	console.log('bling bling');
	console.log(process.env.SHOPIFY_PUBLIC_COMPASS_API_USERNAME);
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
			<h2>#dashboard</h2>
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
