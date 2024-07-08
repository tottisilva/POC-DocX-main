// lib/listFileVersions.ts
import { ListObjectVersionsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";

export const listFileVersions = async (bucketName: string, fileName: string) => {
  const command = new ListObjectVersionsCommand({
    Bucket: bucketName,
    Prefix: fileName,
  });

  try {
    const data = await s3Client.send(command);
    return data.Versions;
  } catch (error) {
    console.error("Error listing file versions:", error);
    throw new Error("Error listing file versions");
  }
};
