import React, { useEffect, useState } from 'react';
import ModemCard from '../components/ModemCard';

const ServiceStatusDashboard = () => {
	const [services, setServices] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAccessToken = async () => {
			try {
				const response = await fetch('/api/get-access-token');
				if (!response.ok) {
					throw new Error(`🥸 Error: HTTP code ${response.status}`);
				}
				const data = await response.json();
				localStorage.setItem('accessToken', data.accessToken);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchAccessToken();
	});

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const accessToken = localStorage.getItem('accessToken');
				if (!accessToken) {
					throw new Error('Access token not available');
				}
				console.log(`Local AccessToken: ${accessToken}`);

				const response = await fetch('/api/services', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				if (!response.ok) {
					throw new Error(`Error: HTTP code ${response.status}`);
				}
				const data = await response.json();
				setServices(data);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchServices();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <p>🤔 Error: {error}</p>;
	}

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
