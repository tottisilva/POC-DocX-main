import aws from 'aws-sdk';
import { NextRequest, NextResponse } from 'next/server';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

async function getLatestVersionId(fileName: string): Promise<string | null> {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
    };

    const data = await s3.headObject(params).promise();
    if (data && data.VersionId) {
      return data.VersionId.toString(); // Ensure VersionId is returned as string
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching latest versionId:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url, 'https://dummy.url'); // Provide a base URL to avoid runtime errors
  const fileName = searchParams.get('fileName');

  if (!fileName) {
    return NextResponse.json({ error: 'Missing fileName parameter' }, { status: 400 });
  }

  try {
    const versionId = await getLatestVersionId(fileName);
    if (versionId) {
      return NextResponse.json({ fileName, versionId });
    } else {
      return NextResponse.json({ error: 'Not Found', message: 'File not found or no versions exist' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
