import type { APIContext } from "astro";
import { SITE_URL } from "../../../friendlyConsts";
import Stripe from "stripe";

export async function GET(context: APIContext): Promise<Response> {
  console.log("coookie", context.request.headers.get("referer"));
  console.log(context.cookies.get("STRIPE_SESSION"));

  const stripeSession = context.cookies.get("STRIPE_SESSION")?.value;

  if (!stripeSession)
    return Response.redirect(
      context.request.headers.get("referer") ?? SITE_URL,
    );

  const stripe = new Stripe(import.meta.env.STRIPE_SK!);

  const session = await stripe.checkout.sessions.retrieve(stripeSession);
  console.log(session.url);
  if (!session.url) return new Response(undefined, { status: 404 });

  return Response.redirect(session.url!); //new Response(JSON.stringify(session.url)!);
}

export const prerender = false;
