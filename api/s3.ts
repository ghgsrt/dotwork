import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${import.meta.env.CLOUDFLARE_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.CLOUDFLARE_ACCESS_ID!,
    secretAccessKey: import.meta.env.CLOUDFLARE_ACCESS_SK!,
  },
});
