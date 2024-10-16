import { json } from '@remix-run/node';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const compassCompany = process.env.SHOPIFY_PUBLIC_COMPASS_COMPANY_ID;
const apiEndpoint = 'https://api-compass.speedcast.com/v2.0';

export const loader = async ({ request }) => {
	try {
		const authHeader = request.headers.get('Authorization');
		if (!authHeader) {
			return json({ message: 'Unauthorized' }, { status: 401 });
		}

		const token = authHeader.split(' ')[1];
		const response = await axios.get(`${apiEndpoint}/company/${compassCompany}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return json(response.data);
	} catch (error) {
		console.error('Error fetching services:', error);
		return json({ message: 'Error fetching services' }, { status: 500 });
	}
};
