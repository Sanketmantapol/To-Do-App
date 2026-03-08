import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "@/lib/minioclient";
import config from "@/lib/config";

export async function POST(req: Request) {
  const { key } = await req.json();

  if (!key) {
    return Response.json({ error: "No key provided" }, { status: 400 });
  }

  const command = new GetObjectCommand({
    Bucket: config.minio.bucketName,
    Key: key,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60, 
  });

  return Response.json({ presignedUrl });
}