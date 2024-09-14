import type { Context, Config } from "@netlify/functions";

const PostProduct = async (
  request: Request,
  context: Context,
): Promise<Response> => {
  if (
    context.cookies.get(import.meta.env.COOKIE_KEY) !==
    import.meta.env.COOKIE_VALUE
  )
    return new Response(
      JSON.stringify({ error: "Invalid or expired cookie" }),
      { status: 400 },
    );

  const path = request.url.split("/");
  const target = path.pop() || path.pop()!;

  if (target === "portal") {
  }

//   if (pages.includes(target)) {
//   }

  // else item

  return new Response("", { status: 200 })
};

// const portal = async (request: Request, context: Context) => {
//   if (request.method === "GET") return GetPortal(request, context);
//   return PostPortal(request, context);
// };

export default PostProduct;

export const config: Config = {
  path: "/admin/api/product/image",
  method: ["POST"],
};
