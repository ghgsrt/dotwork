// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import type { Context, Config } from "@netlify/functions";
// import { s3 } from "../../api/s3";

// async function generatePresignedUrl(
//   key: string,
//   contentType: string,
//   expiresIn = 3600,
// ) {
//   const command = new PutObjectCommand({
//     Bucket: Netlify.env.get("CLOUDFLARE_BUCKET_IMAGES"),
//     Key: key,
//     ContentType: contentType,
//   });

//   try {
//     const signedUrl = await getSignedUrl(s3, command, { expiresIn });
//     return signedUrl;
//   } catch (error) {
//     console.error("Error generating pre-signed URL:", error);
//     throw error;
//   }
// }

// const GetPresignedUrl = async (
//   request: Request,
//   context: Context,
// ): Promise<Response> => {
//   if (
//     context.cookies.get(Netlify.env.get("COOKIE_KEY")!) !==
//     Netlify.env.get("COOKIE_VALUE")!
//   )
//     return new Response(
//       JSON.stringify({ error: "Invalid or expired cookie" }),
//       { status: 400 },
//     );

//   return new Response(
//     JSON.stringify(
//       await generatePresignedUrl(
//         context.params.fileName,
//         `image/${context.params.fileName.split(".")[1]}`,
//       ),
//     ),
//   );
// };

// export default GetPresignedUrl;

// export const config: Config = {
//   path: "/admin/api/generate-upload-url/:fileName",
//   method: ["GET"],
// };
