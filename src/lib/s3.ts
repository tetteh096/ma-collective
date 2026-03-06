import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_BUCKET_NAME!;
const REGION = process.env.AWS_REGION!;

/**
 * Upload a file buffer to S3 and return the public URL
 */
export async function uploadToS3(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  folder = 'products'
): Promise<string> {
  const ext = originalName.split('.').pop() ?? 'jpg';
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    })
  );

  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

/**
 * Delete a file from S3 by its full URL
 */
export async function deleteFromS3(url: string): Promise<void> {
  const key = url.split('.amazonaws.com/').pop();
  if (!key) return;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}
