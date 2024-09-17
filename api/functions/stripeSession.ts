import type { Context, Config } from "@netlify/functions";
import Stripe from "stripe";
import { SITE_URL } from "../../src/friendlyConsts";

const stripe = new Stripe(Netlify.env.get("STRIPE_SK")!);

async function getAllLineItems(sessionId: string) {
  let hasMore = true;
  let startingAfter = null;
  const allLineItems = [];

  while (hasMore) {
    //@ts-ignore -- likely the single most idiotic circular dependency issue I've ever encountered
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
      starting_after: startingAfter,
    });

    allLineItems.push(...lineItems.data);
    hasMore = lineItems.has_more;

    if (hasMore && lineItems.data.length > 0) {
      startingAfter = lineItems.data[lineItems.data.length - 1].id;
    }
  }

  return allLineItems
    .map((item) => {
      if (!item.price) return undefined;
      if (!item.quantity) return undefined;

      return { price: item.price.id, quantity: item.quantity };
    })
    .filter(Boolean) as { price: string; quantity: number }[];
}

async function postToStripeSession(
  request: Request,
  context: Context,
): Promise<Response> {
  const formData = await request.formData();
  //@ts-ignore
  const newLineItem: { price: string; quantity: number } = {};
  for (const [key, value] of formData) {
    //@ts-ignore
    newLineItem[key] = value;
  }

  let line_items: { price: string; quantity: number }[];
  if (!context.cookies.get("STRIPE_SESSION")) line_items = [];
  else
    line_items = await getAllLineItems(context.cookies.get("STRIPE_SESSION"));

  const existingItem = line_items.find(
    (item) => item.price === newLineItem.price,
  );
  if (existingItem) existingItem.quantity! += 1;
  else line_items.push(newLineItem);

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: SITE_URL,
    cancel_url: SITE_URL,
    //   automatic_tax: { enabled: true },
  });

  //   console.log(session)

  context.cookies.set({
    name: "STRIPE_SESSION",
    value: session.id,
    // secure: true,
    // sameSite: "Strict",
    maxAge: 604800,
  });
  console.log(context.cookies.get("STRIPE_SESSION"));

  return new Response("", { status: 200 });
}

async function patchToStripeSession(
  request: Request,
  context: Context,
): Promise<Response> {
  const updatedLineItem = await request.json();

  const line_items = await getAllLineItems(
    context.cookies.get("STRIPE_SESSION"),
  );

  const existingItem = line_items.findIndex(
    (item) => item.price === updatedLineItem.price,
  );
  if (existingItem) {
    if (updatedLineItem.quantity === 0) line_items.splice(existingItem, 1);
    else line_items[existingItem].quantity = updatedLineItem.quantity;
  } else {
    // shouldn't ever be reached
    line_items.push(updatedLineItem);
  }

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: SITE_URL,
    cancel_url: SITE_URL,
    // automatic_tax: { enabled: true },
  });

  context.cookies.set({
    name: "STRIPE_SESSION",
    value: session.id,
    secure: true,
    sameSite: "Strict",
    maxAge: 604800,
  });

  return new Response("", { status: 200 });
}

async function deleteFromStripeSession(
  request: Request,
  context: Context,
): Promise<Response> {
  const lineItemToRemove = await request.json();

  const line_items = await getAllLineItems(
    context.cookies.get("STRIPE_SESSION"),
  );

  const existingItem = line_items.findIndex(
    (item) => item.price === lineItemToRemove.price,
  );
  if (existingItem) line_items.splice(existingItem, 1);

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: SITE_URL,
    cancel_url: SITE_URL,
    // automatic_tax: { enabled: true },
  });

  context.cookies.set({
    name: "STRIPE_SESSION",
    value: session.id,
    secure: true,
    sameSite: "Strict",
    maxAge: 604800,
  });

  return new Response("", { status: 200 });
}

export default function stripeSession(request: Request, context: Context) {
  if (request.method === "POST") postToStripeSession(request, context);
  else if (request.method === "PATCH") patchToStripeSession(request, context);
  else deleteFromStripeSession(request, context);
}

export const config: Config = {
  path: "/api/stripe-session",
  method: ["DELETE", "POST", "PATCH"],
};
