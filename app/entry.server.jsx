import { PassThrough } from 'stream';
import { renderToPipeableStream } from 'react-dom/server';
import { RemixServer } from '@remix-run/react';
import { createReadableStreamFromReadable } from '@remix-run/node';
import { isbot } from 'isbot';
import { addDocumentResponseHeaders } from './shopify.server';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const ABORT_DELAY = 5000;

// Use dynamic import for the router
(async () => {
	const apiRouter = await import('./routes/api.jsx');
	app.use('/api', apiRouter.default);
})();

// Start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
// 	console.log(`Server is running on port ${port} !`);
// });

// Remix code
export default async function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
	addDocumentResponseHeaders(request, responseHeaders);
	const userAgent = request.headers.get('user-agent');
	const callbackName = isbot(userAgent ?? '') ? 'onAllReady' : 'onShellReady';

	return new Promise((resolve, reject) => {
		const { pipe, abort } = renderToPipeableStream(
			<RemixServer
				context={remixContext}
				url={request.url}
				abortDelay={ABORT_DELAY}
			/>,
			{
				[callbackName]: () => {
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set('Content-Type', 'text/html');
					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						})
					);
					pipe(body);
				},
				onShellError(error) {
					reject(error);
				},
				onError(error) {
					responseStatusCode = 500;
					console.error(error);
				},
			}
		);

		setTimeout(abort, ABORT_DELAY);
	});
}
