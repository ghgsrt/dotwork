import type { APIContext } from 'astro';
import { promises as fs } from 'fs';
import { join } from 'path';

const pages = ['shop'];

export const GetPortal = async (context: APIContext): Promise<Response> => {
	console.log(context.cookies.get(import.meta.env.COOKIE_KEY));
	if (
		context.cookies.get(import.meta.env.COOKIE_KEY) !==
		import.meta.env.COOKIE_VALUE
	)
		return new Response('', { status: 400 });

	const path = context.url.pathname.split('/');
	const target = path.pop() || path.pop()!;
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

export const PostPortal = async (context: APIContext): Promise<Response> => {
	if (
		context.cookies.get(import.meta.env.COOKIE_KEY) !==
		import.meta.env.COOKIE_VALUE
	)
		return new Response(
			JSON.stringify({ error: 'Invalid or expired cookie' }),
			{ status: 400 }
		);

	const path = context.url.pathname.split('/');
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

export const prerender = false;
