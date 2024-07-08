import { NextResponse, NextRequest } from 'next/server';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('fileName');
  const fileType = searchParams.get('fileType');
  const versionId = searchParams.get('versionId');

  if (!fileName || !fileType) {
    return NextResponse.json({ error: 'Missing fileName or fileType' }, { status: 400 });
  }

  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    VersionId: versionId || undefined,
  };

  try {
    // Generate the pre-signed URL
    const signedUrl = await s3.getSignedUrlPromise('putObject', s3Params);

    // Return the signed URL
    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error('Error creating pre-signed URL:', error);
    return NextResponse.json({ error: 'Failed to create pre-signed URL' }, { status: 500 });
  }
}
