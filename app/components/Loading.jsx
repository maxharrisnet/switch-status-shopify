import React, { useEffect, useState } from 'react';
import './Status.css';

const Loading = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate data fetching
		const timer = setTimeout(() => {
			setLoading(false);
		}, 3000); // Adjust the timeout duration as needed

		return () => clearTimeout(timer); // Cleanup the timer on component unmount
	}, []);

	if (!loading) {
		return null; // Don't render anything if not loading
	}

	return (
		<div className='loading-overlay'>
			<div className='spinner'></div>
		</div>
	);
};

export default Loading;
