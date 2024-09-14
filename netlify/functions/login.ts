import type { Config, Context } from "@netlify/functions";

export default async function login(
  request: Request,
  context: Context,
): Promise<Response> {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (
    username !== Netlify.env.get("ADMIN_USERNAME") ||
    password !== Netlify.env.get("ADMIN_PASSWORD")
  ) {
    return new Response(
      JSON.stringify({
        error: "Invalid credentials 🤨",
      }),
      { status: 400 },
    );
  }
console.log(Netlify.env.get("ADMIN_COOKIE_KEY"))
  context.cookies.set({
    name: Netlify.env.get("ADMIN_COOKIE_KEY")!,
    value: Netlify.env.get("ADMIN_COOKIE_VALUE")!,
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 3600,
  });

  return new Response("", { status: 200 });
}

export const config: Config = {
  path: "/admin/api/login",
  method: ["POST"],
};
