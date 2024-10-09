import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import ServiceStatusDashboard from './components/ServiceStatusDashboard';

export default function App() {
	return (
		<html>
			<head>
				<meta charSet='utf-8' />
				<meta
					name='viewport'
					content='width=device-width,initial-scale=1'
				/>
				<link
					rel='preconnect'
					href='https://cdn.shopify.com/'
				/>
				<link
					rel='stylesheet'
					href='https://cdn.shopify.com/static/fonts/inter/v4/styles.css'
				/>
				<Meta />
				<Links />
			</head>
			<body>
				<h2>Status!</h2>
				<section>
					<div className='container-sm'>
						<div className='row sticky-top  bg-light p-4 mb-3 border-medium border-bottom'>
							<div>{/* logo */}</div>
						</div>
						<ServiceStatusDashboard />
					</div>
				</section>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
