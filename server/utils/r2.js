const { S3Client, DeleteObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

// Only initialize if credentials exist to avoid crashes on startup if env is missing
const s3Client = accountId ? new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
}) : null;

const generatePresignedUrl = async (key, contentType) => {
  if (!s3Client) throw new Error("R2 credentials not configured");

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  
  // Ensure public URL doesn't have a trailing slash before appending key
  const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '') || '';
  const publicUrl = `${baseUrl}/${key}`;
  
  return { uploadUrl, publicUrl, key };
};

const deleteFromR2 = async (key) => {
  if (!key || !s3Client) return;
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting from R2:', error);
  }
};

module.exports = { s3Client, generatePresignedUrl, deleteFromR2 };
