import type { Context, Config } from "@netlify/functions";
import Stripe from "stripe";

const PostProduct = async (
  request: Request,
  context: Context,
): Promise<Response> => {
  if (
    context.cookies.get(Netlify.env.get("COOKIE_KEY")!) !==
    Netlify.env.get("COOKIE_VALUE")!
  )
    return new Response(
      JSON.stringify({ error: "Invalid or expired cookie" }),
      { status: 400 },
    );

  const stripe = new Stripe(Netlify.env.get("STRIPE_SK")!);

  const data = await request.json();
  console.log(data);

  if (!data.name || !data.description || !data.price || !data.images[0])
    return new Response(JSON.stringify({ error: "Missing product field" }), {
      status: 400,
    });

  const product = await stripe.products.create({
    name: data.name,
    description: data.description,
    images: data.images.map(
      (image: string) =>
        `https://pub-ed97f6dc1a834c2cbb3651b576615bdd.r2.dev/${image}`,
    ),
  });
  try {
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: data.price * 100,
      product: product.id,
    });
  } catch (e) {
    stripe.products.del(product.id);
  }

  return new Response("", { status: 200 });
};

const DeleteProduct = async (
  request: Request,
  context: Context,
): Promise<Response> => {
  if (
    context.cookies.get(Netlify.env.get("COOKIE_KEY")!) !==
    Netlify.env.get("COOKIE_VALUE")!
  )
    return new Response(
      JSON.stringify({ error: "Invalid or expired cookie" }),
      { status: 400 },
    );

  const stripe = new Stripe(Netlify.env.get("STRIPE_SK")!);

  const id = (await request.json()).id;

  const prices = (await stripe.prices.list({ product: id })).data;
  for (const price of prices) stripe.prices.update(price.id, { active: false });

  const temp = await stripe.products.update(id, { active: false });
  console.log(temp.active);

  return new Response("", { status: 200 });
};

export default function Product(request: Request, context: Context) {
  if (request.method === "POST") PostProduct(request, context);
  else DeleteProduct(request, context);
}

export const config: Config = {
  path: ["/admin/api/product", "/admin/api/product/*"],
  method: ["POST", "DELETE"],
};
