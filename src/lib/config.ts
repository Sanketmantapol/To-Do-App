const config = {
  minio: {
    endpoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucketName: process.env.NEXT_PUBLIC_MINIO_BUCKET_NAME,
    region: process.env.MINIO_REGION ,
  },
};

export default config;