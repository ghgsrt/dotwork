// import type { APIContext } from 'astro';

// export async function POST(context: APIContext): Promise<Response> {
// 	const formData = await context.request.formData();
// 	const username = formData.get('username');
// 	const password = formData.get('password');

// 	if (
// 		username !== import.meta.env.ADMIN_USERNAME ||
// 		password !== import.meta.env.ADMIN_PASSWORD
// 	) {
// 		return new Response(
// 			JSON.stringify({
// 				error: 'Invalid credentials 🤨',
// 			}),
// 			{ status: 400 }
// 		);
// 	}

// 	context.cookies.set(
// 		import.meta.env.COOKIE_KEY,
// 		import.meta.env.COOKIE_VALUE,
// 		{
// 			httpOnly: true,
// 			secure: true,
// 			sameSite: 'strict',
// 			maxAge: 3600,
// 		}
// 	);

// 	return new Response('', { status: 200 });
// }

// export const prerender = false;