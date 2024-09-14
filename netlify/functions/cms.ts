import type { Context, Config } from "@netlify/functions";

const cms = async (request: Request, context: Context): Promise<Response> => {
  if (
    context.cookies.get(Netlify.env.get("COOKIE_KEY")!) !==
    Netlify.env.get("COOKIE_VALUE")
  )
    return new Response(
      JSON.stringify({ error: "Invalid or expired cookie" }),
      { status: 400 },
    );

  const body = await request.json();

  for (const key in body) {
    if (!body[key]) continue;
    if (!Netlify.env.get(key))
      return new Response(JSON.stringify({ error: "Bad Body 😠" }), {
        status: 400,
      });

    const response = await fetch(
    //   `https://api.netlify.com/api/v1/sites/${Netlify.env.get("SITE_ID")}/env/${key}`,
        `https://api.netlify.com/api/v1/accounts/ghgsrt/env/${key}?site_id=${Netlify.env.get("SITE_ID")}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${Netlify.env.get("NETLIFY_ACCESS_TOKEN")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: "production",
          context_parameter: "",
          value: body[key],
        }),
      },
    );

    if (!response.ok)
      throw new Error(`HTTP error! status: ${await response.text()}`);
  }

  return new Response("", { status: 200 });
};

export default cms;

export const config: Config = {
  path: "/admin/api/cms",
  method: ["PUT"],
};
