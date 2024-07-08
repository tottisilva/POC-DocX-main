import { NextResponse, NextRequest } from 'next/server';
import AWS from 'aws-sdk';
import { Readable } from 'stream';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
  }

  const url = req.url.split('?')[1]; // Extract query string from URL

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ success: false, message: 'Invalid URL parameter' }, { status: 400 });
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    console.log('Decoded URL:', decodedUrl);

    // Split the decoded URL into path and query parameters
    const [path, queryString] = decodedUrl.split('?');
    console.log('Path:', path);
    console.log('Query String:', queryString);

    // Extract versionId if present in query parameters
    let versionId = '';
    if (queryString) {
      const params = new URLSearchParams(queryString);
      if (params.has('versionId')) {
        versionId = params.get('versionId') || '';
      }
    }
    console.log('Extracted VersionId:', versionId);

    // Extract document name from path
    const documentName = path.split('/').pop() || 'document'; // Adjust based on your path structure

    console.log('Document Name:', documentName);

    // Prepare S3 params
    const params: AWS.S3.GetObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || '',
      Key: documentName, // Use the path without the versionId
      VersionId: versionId, // Optionally include VersionId if provided
    };

    console.log('S3 Params:', params);

    const file = await s3.getObject(params).promise();
    console.log('File retrieved from S3:', file);

    if (!file.Body) {
      return NextResponse.json({ success: false, message: 'File not found' }, { status: 404 });
    }

    let bodyInit: Buffer | Uint8Array;
    if (file.Body instanceof Buffer || file.Body instanceof Uint8Array) {
      bodyInit = file.Body;
    } else if (typeof file.Body === 'string') {
      bodyInit = Buffer.from(file.Body, 'utf-8');
    } else if (file.Body instanceof Readable) {
      // Read the stream into a Buffer or Uint8Array
      const chunks: Uint8Array[] = [];
      for await (const chunk of file.Body) {
        chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
      }
      bodyInit = Buffer.concat(chunks);
    } else {
      throw new Error('Unsupported file type');
    }

    const contentType = file.ContentType || 'application/octet-stream';
    console.log('Final Document Name:', documentName);

    return new NextResponse(bodyInit, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${documentName}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading file from S3:', error);
    return NextResponse.json({ success: false, message: 'Error downloading file from S3' }, { status: 500 });
  }
}
