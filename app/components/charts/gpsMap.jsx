import React, { useEffect, useState } from 'react';

const GpsMap = ({ gps, modemId }) => {
	const [map, setMap] = useState(null);

	useEffect(() => {
		const loadGoogleMapsScript = () => {
			return new Promise((resolve, reject) => {
				if (document.getElementById('google-maps-script')) {
					resolve();
					return;
				}

				const script = document.createElement('script');
				script.id = 'google-maps-script';
				script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}`;
				script.async = true;
				script.defer = true;
				script.onload = resolve;
				script.onerror = reject;
				document.head.appendChild(script);
			});
		};

		const initMap = async () => {
			await loadGoogleMapsScript();

			if (gps && gps.lat && gps.lon) {
				const mapInstance = new google.maps.Map(document.getElementById('map'), {
					center: {
						lat: gps.lat,
						lng: gps.lon,
					},
					zoom: 8,
				});

				new google.maps.Marker({
					position: {
						lat: gps.lat,
						lng: gps.lon,
					},
					map: mapInstance,
				});

				setMap(mapInstance);
			}
		};

		initMap();
	}, [gps]);

	return (
		<>
			{gps && gps.lat && gps.lon ? (
				<div
					id='map'
					style={{ height: '400px', width: '100%' }}
				></div>
			) : (
				<div className='row text-center p-4 mt-2'>
					<p>No GPS data available for modem {modemId}</p>
				</div>
			)}
		</>
	);
};

export default GpsMap;
