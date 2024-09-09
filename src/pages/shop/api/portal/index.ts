import { getCollection } from 'astro:content';
import { GetPortal, PostPortal } from '../../../../assets/portal';

export const GET = GetPortal;
export const POST = PostPortal;

const beans = (await getCollection('art')).map((item) => ({
	params: { slug: item.slug },
}));

export function getStaticPaths() {
	return beans;
}

export const prerender = false;
