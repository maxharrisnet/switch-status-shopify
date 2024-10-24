import React, { useEffect, useState } from 'react';

const ServiceStatusDashboard = () => {
	const [services, setServices] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAccessToken = async () => {
			try {
				const storedAccessToken = localStorage.getItem('accessToken');
				if (!storedAccessToken) {
					const response = await fetch('/api/get-access-token');
					if (!response.ok) {
						throw new Error(`🥸 Error: HTTP code ${response.status}`);
					}
					const data = await response.json();
					localStorage.setItem('accessToken', data.accessToken);
				}
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchAccessToken();
	}, []); // Empty dependency array to run only once on mount

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
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
