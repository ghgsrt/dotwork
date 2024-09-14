import type { APIContext } from "astro";
import { getAllLineItems } from "./session";

export const GET = async (context: APIContext) => {
  const sessionCookie = context.cookies.get("STRIPE_SESSION")?.value;
  if (!sessionCookie)
    return new Response("No Stripe checkout session exists for this user.", {
      status: 400,
    });

  const line_items = await getAllLineItems(sessionCookie);

  return new Response(JSON.stringify(line_items), { status: 200 });
};
