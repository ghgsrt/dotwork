import type { APIContext } from "astro";

export const PUT = async (context: APIContext): Promise<Response> => {
  if (
    context.cookies.get(import.meta.env.COOKIE_KEY!)?.value !==
    import.meta.env.COOKIE_VALUE
  )
    return new Response(
      JSON.stringify({ error: "Invalid or expired cookie" }),
      { status: 400 },
    );

  const body = await context.request.json();

  for (const key in body) {
    if (!body[key]) continue;
    if (!import.meta.env[key])
      return new Response(JSON.stringify({ error: "Bad Body 😠" }), {
        status: 400,
      });

    const response = await fetch(
      //   `https://api.netlify.com/api/v1/sites/${Netlify.env.get("SITE_ID")}/env/${key}`,
      `https://api.netlify.com/api/v1/accounts/ghgsrt/env/${key}?site_id=${import.meta.env.SITE_ID}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${import.meta.env.NETLIFY_ACCESS_TOKEN}`,
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

  const res = await fetch(import.meta.env.ADMIN_REDEPLOY, {
    method: "POST",
  });
  console.log(res);

  return new Response("", { status: 200 });
};

export const prerender = false;
