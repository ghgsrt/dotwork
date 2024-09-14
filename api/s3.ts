import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${Netlify.env.get("CLOUDFLARE_ACCOUNT_ID")!}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: Netlify.env.get("CLOUDFLARE_ACCESS_ID")!,
    secretAccessKey: Netlify.env.get("CLOUDFLARE_ACCESS_SK")!,
  },
});
