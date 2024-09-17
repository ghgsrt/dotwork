import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { APIContext } from "astro";
import { s3 } from "../../../../../api/s3";

export const generatePresignedUrl = async (
  key: string,
  contentType: string,
  expiresIn = 3600,
) => {
  const command = new PutObjectCommand({
    Bucket: import.meta.env.CLOUDFLARE_BUCKET_IMAGES,
    Key: key,
    ContentType: contentType,
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw error;
  }
};

export const GET = async (context: APIContext): Promise<Response> => {
  if (
    context.cookies.get(import.meta.env.COOKIE_KEY!)?.value !==
    import.meta.env.COOKIE_VALUE!
  )
    return new Response(
      JSON.stringify({ error: "Invalid or expired cookie" }),
      { status: 400 },
    );

  if (!context.params.slug)
    return new Response(
      JSON.stringify({
        error: "Invalid path 😠.",
      }),
      { status: 400 },
    );

  return new Response(
    JSON.stringify(
      await generatePresignedUrl(
        context.params.slug,
        `image/${context.params.slug.split(".")[1]}`,
      ),
    ),
  );
};

export const prerender = false;
