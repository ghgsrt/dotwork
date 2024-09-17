// import type { Context, Config } from "@netlify/functions";
// import { s3 } from "../../api/s3";
// import { ListObjectsV2Command } from "@aws-sdk/client-s3";

// export const GetBucketKeys = async (request: Request, context: Context) => {
//   if (
//     context.cookies.get(Netlify.env.get("COOKIE_KEY")!) !==
//     Netlify.env.get("COOKIE_VALUE")!
//   )
//     return new Response(
//       JSON.stringify({ error: "Invalid or expired cookie" }),
//       { status: 400 },
//     );
//   console.log("bruh");

//   let imageKeys: any[] = [];
//   try {
//     const command = new ListObjectsV2Command({
//       Bucket: Netlify.env.get("CLOUDFLARE_BUCKET_IMAGES"),
//       // You can add a Prefix here if you want to list objects in a specific "folder"
//       // Prefix: "images/",
//     });

//     let isTruncated: boolean | undefined = true;
//     let continuationToken = undefined;

//     while (isTruncated) {
//       const { Contents, IsTruncated, NextContinuationToken } =
//         await s3.send(command);

//       if (!Contents) throw new Error();

//       const keys = Contents.map((object) => object.Key);
//       imageKeys = [...imageKeys, ...keys];

//       isTruncated = IsTruncated;
//       continuationToken = NextContinuationToken;

//       if (isTruncated) {
//         command.input.ContinuationToken = continuationToken;
//       }
//     }
//   } catch (error) {
//     console.error("Error listing objects:", error);
//   }

//   return new Response(JSON.stringify(imageKeys));
// };

// export default GetBucketKeys;

// export const config: Config = {
//   path: "/admin/api/bucket-keys",
//   method: ["GET"],
// };
