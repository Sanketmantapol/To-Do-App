import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "@/lib/minioclient";
import config from "@/lib/config";
import prisma from "@/lib/db/prisma";

export async function DELETE(req: Request) {
  const { key, todoId } = await req.json();

  if (!key || !todoId) {
    return Response.json({ error: "Missing key or todoId" }, { status: 400 });
  }

 
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: config.minio.bucketName,
      Key: key,
    })
  );


  await prisma.todo.update({
    where: { id: todoId },
    data: { attachmentURL: null },
  });

  return Response.json({ message: "Attachment deleted successfully" });
}

