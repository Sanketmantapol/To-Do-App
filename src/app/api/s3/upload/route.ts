import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "@/lib/minioclient";
import config from "@/lib/config";

export async function POST(req: Request) {
  const { fileName, fileType, todoId } = await req.json();

  if (!fileName || !fileType || !todoId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const key = `uploads/${Date.now()}-${fileName}`;

 
  const command = new PutObjectCommand({
    Bucket: config.minio.bucketName,
    Key: key,
    ContentType: fileType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn:60, 
  });

  return Response.json({
    presignedUrl,
    key,
    todoId,
  });
}
