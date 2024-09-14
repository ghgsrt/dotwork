import Stripe from "stripe";

export async function createProduct(product: Stripe.ProductCreateParams) {
  const strip = new Stripe(Netlify.env.get("STRIPE_SK")!);

  return await strip.products.create(product);
}

export function pushImages(id: string, ...images: string[]) {
  const strip = new Stripe(Netlify.env.get("STRIPE_SK")!);

  strip.products.update(id, { images });
}
