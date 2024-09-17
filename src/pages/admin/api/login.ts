import type { APIContext } from "astro";

export const POST = async (context: APIContext): Promise<Response> => {
  const formData = await context.request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (
    username !== import.meta.env.ADMIN_USERNAME ||
    password !== import.meta.env.ADMIN_PASSWORD
  ) {
    return new Response(
      JSON.stringify({
        error: "Invalid credentials 🤨",
      }),
      { status: 400 },
    );
  }
  //   console.log(import.meta.env.ADMIN_COOKIE_KEY);
  //   context.cookies.set({
  //     name: import.meta.env.ADMIN_COOKIE_KEY!,
  //     value: import.meta.env.ADMIN_COOKIE_VALUE!,
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "Strict",
  //     maxAge: 3600,
  //   });

  return new Response("", {
    status: 200,
    headers: {
      "Set-Cookie": `${import.meta.env.ADMIN_COOKIE_KEY}=${import.meta.env.ADMIN_COOKIE_VALUE}; Path=/; HttpOnly=true; Secure=true; SameSite=Strict; MaxAge=3600`,
    },
  });
};

export const prerender = false;
