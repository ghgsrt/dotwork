import type { APIContext } from "astro";
import Stripe from "stripe";
import { SITE_URL } from "../../../friendlyConsts";
type LineItem = { price: string; quantity: number };

const stripe = new Stripe(import.meta.env.STRIPE_SK!);

export async function getAllLineItems(sessionId: string) {
  let hasMore = true;
  let startingAfter = undefined;
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
    .filter(Boolean) as LineItem[];
}

export const POST = async (context: APIContext): Promise<Response> => {
  const formData = await context.request.formData();

  const newLineItem = {} as LineItem;
  for (const [key, value] of formData) {
    //@ts-ignore
    newLineItem[key] = value;
  }

  const sessionCookie = context.cookies.get("STRIPE_SESSION")?.value;

  let line_items: { price: string; quantity: number }[];
  if (!sessionCookie) line_items = [];
  else line_items = await getAllLineItems(sessionCookie);

  const existingItem = line_items.find(
    (item) => item.price === newLineItem.price,
  );
  console.log(newLineItem.quantity, typeof newLineItem.quantity);
  if (existingItem) {
    //@ts-ignore
    existingItem.quantity! += parseInt(newLineItem.quantity);
    if (existingItem.quantity > 100) existingItem.quantity = 100;
  } else line_items.push(newLineItem);

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: SITE_URL,
    cancel_url: SITE_URL,
    //   automatic_tax: { enabled: true },
  });

  context.cookies.delete("STRIPE_SESSION");
  context.cookies.delete("STRIPE_SESSION");

  //   context.cookies.set("STRIPE_SESSION", session.id, {
  //     secure: false,
  //     sameSite: "none",
  //     maxAge: 604800,
  //   });

  const length = line_items.reduce((acc, curr) => acc + curr.quantity, 0);

  console.log(session.id);
  const res = new Response(
    JSON.stringify({
      message: "Item added to Stripe checkout session.",
      item: newLineItem,
      length,
    }),
    {
      status: 200,
      headers: {
        "Set-Cookie": `STRIPE_SESSION=${session.id}; Path=/; HttpOnly=false; Secure=false; SameSite=None`,
      },
    },
  );
  return res;
};

export const PATCH = async (context: APIContext): Promise<Response> => {
  const updatedLineItem = await context.request.json();

  const sessionCookie = context.cookies.get("STRIPE_SESSION")?.value;
  if (!sessionCookie)
    return new Response("No Stripe checkout session exists for this user.", {
      status: 400,
    });

  const line_items = await getAllLineItems(sessionCookie);

  const existingItem = line_items.findIndex(
    (item) => item.price === updatedLineItem.price,
  );
  if (existingItem !== -1) {
    if (updatedLineItem.quantity == 0) line_items.splice(existingItem, 1);
    else
      line_items[existingItem].quantity = Math.min(
        100,
        updatedLineItem.quantity,
      );
  } else {
    console.log("help", updatedLineItem, line_items);
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

  //   context.cookies.set("STRIPE_SESSION", session.id, {
  //     // secure: true,
  //     // sameSite: "strict",
  //     maxAge: 604800,
  //   });

  return new Response("Item quantity updated in Stripe checkout session.", {
    status: 200,
    headers: {
      "Set-Cookie": `STRIPE_SESSION=${session.id}; Path=/; HttpOnly=false; Secure=false; SameSite=None`,
    },
  });
};

export const DELETE = async (context: APIContext): Promise<Response> => {
  const lineItemToRemove = await context.request.json();

  const sessionCookie = context.cookies.get("STRIPE_SESSION")?.value;
  if (!sessionCookie)
    return new Response("No Stripe checkout session exists for this user.", {
      status: 400,
    });

  const line_items = await getAllLineItems(sessionCookie);

  const existingItem = line_items.findIndex(
    (item) => item.price === lineItemToRemove.price,
  );
  if (existingItem !== -1) line_items.splice(existingItem, 1);

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: SITE_URL,
    cancel_url: SITE_URL,
    // automatic_tax: { enabled: true },
  });

  //   context.cookies.set("STRIPE_SESSION", session.id, {
  //     secure: true,
  //     sameSite: "strict",
  //     maxAge: 604800,
  //   });

  return new Response("Item removed from Stripe checkout session.", {
    status: 200,
    headers: {
      "Set-Cookie": `STRIPE_SESSION=${session.id}; Path=/; HttpOnly=false; Secure=false; SameSite=None`,
    },
  });
};

export const prerender = false;
