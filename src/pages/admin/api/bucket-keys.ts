import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "../../../../api/s3";
import type { APIContext } from "astro";

export const GET = async (context: APIContext) => {
  if (
    context.cookies.get(import.meta.env.COOKIE_KEY!)?.value !==
    import.meta.env.COOKIE_VALUE!
  )
    return new Response(
      JSON.stringify({ error: "Invalid or expired cookie" }),
      { status: 400 },
    );

  let imageKeys: any[] = [];
  try {
    const command = new ListObjectsV2Command({
      Bucket: import.meta.env.CLOUDFLARE_BUCKET_IMAGES,
    });

    let isTruncated: boolean | undefined = true;
    let continuationToken = undefined;

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await s3.send(command);

      if (!Contents) throw new Error();

      const keys = Contents.map((object) => object.Key);
      imageKeys = [...imageKeys, ...keys];

      isTruncated = IsTruncated;
      continuationToken = NextContinuationToken;

      if (isTruncated) {
        command.input.ContinuationToken = continuationToken;
      }
    }
  } catch (error) {
    console.error("Error listing objects:", error);
  }

  return new Response(JSON.stringify(imageKeys));
};

export const prerender = false;
