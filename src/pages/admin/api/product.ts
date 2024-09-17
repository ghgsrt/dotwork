import type { Context } from "@netlify/functions";
import type { APIContext } from "astro";
import Stripe from "stripe";

export const POST = async (context: APIContext): Promise<Response> => {
  if (
    context.cookies.get(import.meta.env.COOKIE_KEY!)?.value !==
    import.meta.env.COOKIE_VALUE!
  )
    return new Response(
      JSON.stringify({ error: "Invalid or expired cookie" }),
      { status: 400 },
    );

  const stripe = new Stripe(import.meta.env.STRIPE_SK!);

  const data = await context.request.json();
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
    default_price_data: {
      currency: "usd",
      unit_amount: data.price * 100,
    },
  });

  console.log(product);

  const res = await fetch(import.meta.env.ADMIN_REDEPLOY);
  console.log(res);

  return new Response("", { status: 200 });
};

export const DELETE = async (context: APIContext): Promise<Response> => {
  if (
    context.cookies.get(import.meta.env.COOKIE_KEY!)?.value !==
    import.meta.env.COOKIE_VALUE!
  )
    return new Response(
      JSON.stringify({ error: "Invalid or expired cookie" }),
      { status: 400 },
    );

  const stripe = new Stripe(import.meta.env.STRIPE_SK!);

  const id = (await context.request.json()).id;

  const prices = (await stripe.prices.list({ product: id })).data;
  for (const price of prices) stripe.prices.update(price.id, { active: false });

  const temp = await stripe.products.update(id, { active: false });
  console.log(temp.active);

  const res = await fetch(import.meta.env.ADMIN_REDEPLOY);
  console.log(res);

  return new Response("", { status: 200 });
};

export const prerender = false;
