// import type { Context, Config } from "@netlify/functions";
// import Stripe from "stripe";
// import { SITE_URL } from "../../src/friendlyConsts";

// export default async function checkout(
//   request: Request,
//   context: Context,
// ): Promise<Response> {
//   console.log("coookie", request.headers.get("referer"));
//   console.log(context.cookies.get("STRIPE_SESSION"));

//   if (!context.cookies.get("STRIPE_SESSION"))
//     return Response.redirect(request.headers.get("referer") ?? SITE_URL);
//   //   const session = await stripe.checkout.sessions.create({
//   //     mode: "payment",
//   //     line_items: cart.map((item: any) => {
//   //       item.adjustable_quantity = { enabled: true };
//   //       return item;
//   //     }),
//   //     success_url: SITE_URL,
//   //     cancel_url: SITE_URL,
//   //     // automatic_tax: { enabled: true },
//   //   });
//   const stripe = new Stripe(Netlify.env.get("STRIPE_SK")!);

//   const session = await stripe.checkout.sessions.retrieve(
//     context.cookies.get("STRIPE_SESSION"),
//   );
//   console.log(session.url);
//   if (!session.url) return new Response("", { status: 404 });

//   return Response.redirect(session.url!); //new Response(JSON.stringify(session.url)!);
// }

// export const config: Config = {
//   path: "/api/checkout",
//   method: ["GET"],
// };
