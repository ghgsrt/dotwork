import type { Config, Context } from '@netlify/functions';
import { promises as fs } from 'fs';
import { join } from 'path';

const pages = ['shop'];

const GetPortal = async (
	request: Request,
	context: Context
): Promise<Response> => {
	console.log(context.cookies.get(Netlify.env.get('COOKIE_KEY')!));
	if (
		context.cookies.get(Netlify.env.get('COOKIE_KEY')!) !==
		Netlify.env.get('COOKIE_VALUE')
	)
		return new Response('', { status: 400 });

	const path = request.url.split('/');
	const target = path.pop() || path.pop()!;
	console.log(target)
	const jsFilePrefix =
		target === 'portal'
			? 'home'
			: pages.includes(target)
			? target
			: `${path.pop()!}Item`;

	const filePath = join(
		process.cwd(),
		'src',
		'assets',
		'js',
		`${jsFilePrefix}ClientPortal.js`
	);

	try {
		const jsContent = await fs.readFile(filePath, 'utf-8');

		return new Response(jsContent, {
			headers: {
				'Content-Type': 'application/javascript',
			},
		});
	} catch (error) {
		return new Response('File not found', { status: 404 });
	}
};

const PostPortal = async (
	request: Request,
	context: Context
): Promise<Response> => {
	if (
		context.cookies.get(import.meta.env.COOKIE_KEY) !==
		import.meta.env.COOKIE_VALUE
	)
		return new Response(
			JSON.stringify({ error: 'Invalid or expired cookie' }),
			{ status: 400 }
		);

	const path = request.url.split('/');
	const target = path.pop() || path.pop()!;

	if (target === 'portal') {
	}

	if (pages.includes(target)) {
	}

	// else item

	return new Response('', {
		headers: {
			'Content-Type': 'application/javascript',
		},
	});
};

const portal = async (request: Request, context: Context) => {
	if (request.method === 'GET') return GetPortal(request, context);
	return PostPortal(request, context);
};

export default portal;

export const config: Config = {
	path: ['/admin/api/portal', '/admin/api/portal/*'],
	method: ['GET', 'POST'],
};
