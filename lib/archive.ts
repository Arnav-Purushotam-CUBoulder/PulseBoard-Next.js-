import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { AnalysisResult, FeedbackItem } from "@/lib/types";

type ArchiveRecord = {
  provider: string;
  location: string;
};

export async function persistAnalysis(feedback: FeedbackItem[], result: AnalysisResult): Promise<ArchiveRecord> {
  const createdAt = new Date().toISOString();
  const payload = JSON.stringify({ createdAt, feedback, result }, null, 2);
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION ?? "us-east-1";
  const prefix = (process.env.AWS_S3_PREFIX ?? "pulseboard-analyses").replace(/^\/+|\/+$/g, "");

  if (bucket) {
    const key = `${prefix}/${createdAt.slice(0, 10)}/${crypto.randomUUID()}.json`;
    const client = new S3Client({ region });
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: payload,
      ContentType: "application/json"
    }));

    return {
      provider: "aws-s3",
      location: `s3://${bucket}/${key}`
    };
  }

  const localDir = join(process.cwd(), "data", "analysis-archives");
  await mkdir(localDir, { recursive: true });
  const filePath = join(localDir, `${crypto.randomUUID()}.json`);
  await writeFile(filePath, payload, "utf8");

  return {
    provider: "local",
    location: filePath
  };
}
