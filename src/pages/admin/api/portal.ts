import type { APIContext } from "astro";
import { promises as fs } from "fs";
import { join } from "path";
import { SITE_URL } from "../../../friendlyConsts";

const pages = ["shop"];
const scripts = ["initAdminPortal", "themeToggle"];

export const GET = async (context: APIContext): Promise<Response> => {
  if (
    context.cookies.get(import.meta.env.ADMIN_COOKIE_KEY)?.value !==
    import.meta.env.ADMIN_COOKIE_VALUE
  )
    return new Response("", { status: 400 });
  //   console.log(context.url.pathname);
  //   const path = context.url.pathname.split("/");
  //   const target = path.pop() || path.pop()!;
  //   console.log(target);

  // canonical url
  const _portal = await fetch(`${SITE_URL}/admin/portal`);
  console.log("_portal", _portal);
  const portal = _portal.text();
  //   const filePrefix =
  //     target === "portal"
  //       ? "home"
  //       : pages.includes(target)
  //         ? target
  //         : `${path.pop()!}Item`;

  //   const jsFilePath = join(
  //     process.cwd(),
  //     "src",
  //     "assets",
  //     "js",
  //     `${filePrefix}ClientPortal.js`,
  //   );

  //   const jsFiles: Promise<string>[] = [fs.readFile(jsFilePath, "utf-8")];
  const jsFiles: Promise<Response>[] = [];
  for (const script of scripts) {
    // const extraFilePath = join(
    //   process.cwd(),
    //   "js",
    //   `${script}.js`,
    // );

    const res = fetch(`${SITE_URL}/js/${script}.js`);
    // const scriptContent = fs.readFile(extraFilePath, "utf-8");

    jsFiles.push(res);
  }

  return new Response(
    JSON.stringify({
      js: (
        await Promise.all(
          (await Promise.all(jsFiles)).map((file) => file.text()),
        )
      ).join(";"),
      html: await portal,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const prerender = false;
