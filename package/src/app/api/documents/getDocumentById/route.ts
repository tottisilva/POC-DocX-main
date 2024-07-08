import { NextResponse, NextRequest } from 'next/server';
import aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid'; // Optional: for generating unique file names

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('fileName');
  const fileType = searchParams.get('fileType');
  
  if (!fileName || !fileType) {
    return NextResponse.json({ error: 'Missing fileName or fileType' }, { status: 400 });
  }
  
  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Expires: 60, // Expiry time for the signed URL in seconds
    ContentType: fileType,
  };
  
  try {
    const signedUrl = await s3.getSignedUrlPromise('putObject', s3Params);
    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error('Error creating pre-signed URL:', error);
    return NextResponse.json({ error: 'Failed to create pre-signed URL' }, { status: 500 });
  }
}
