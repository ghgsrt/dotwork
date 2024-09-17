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
  console.log(context.url.pathname);
  const path = context.url.pathname.split("/");
  const target = path.pop() || path.pop()!;
  console.log(target);

  // canonical url
  const portal = fetch(`${SITE_URL}/admin/portal`).then((val) => val.text());
  console.log(await portal);
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
  const jsFiles: Promise<string>[] = [];
  for (const script of scripts) {
    const extraFilePath = join(
      process.cwd(),
      "src",
      "assets",
      "js",
      `${script}.js`,
    );

    const scriptContent = fs.readFile(extraFilePath, "utf-8");

    jsFiles.push(scriptContent);
  }

  return new Response(
    JSON.stringify({
      js: (await Promise.all(jsFiles)).join(";"),
      html: await portal,
    }),
    {
      headers: {
        "Content-Type": "application/javascript",
      },
    },
  );
};

export const prerender = false;
