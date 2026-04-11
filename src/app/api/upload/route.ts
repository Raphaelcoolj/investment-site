import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

const url = process.env.CLOUDINARY_URL || '';
const match = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);

if (match) {
  cloudinary.config({
    api_key: match[1],
    api_secret: match[2],
    cloud_name: match[3],
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'merrick' },
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: (uploadResponse as any).secure_url });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: 'Upload array error' }, { status: 500 });
  }
}
