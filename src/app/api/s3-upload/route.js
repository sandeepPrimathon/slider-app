import { NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "data.json");
let showSliderImage = [];

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

const readFileData = () => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return;
    }
    showSliderImage = JSON.parse(data);
  });
};

const writeFileData = (dataToWrite) => {
  fs.writeFile(filePath, JSON.stringify(dataToWrite), (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
      return;
    }
  });
};

async function uploadFileToS3(file, fileName) {
  fileName = Date.now();

  const fileBuffer = file;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${fileName}`,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name);

    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function GET(request, response) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  try {
    const command = new ListObjectsCommand({ Bucket: bucketName });
    const response = await s3Client.send(command);
    let filenames = response.Contents?.map((object) => object.Key ?? "");
    readFileData();
    filenames = filenames.map((item) => ({
      name: item,
      isShow: showSliderImage.includes(item),
    }));
    return NextResponse.json({ success: true, filenames });
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function PUT(req, res) {
  try {
    const { data } = await req.json();

    if (!data) {
      return NextResponse.json({ message: "send Data" });
    }
    readFileData();
    if (data.isShow) {
      showSliderImage.push(data.id);
    } else {
      showSliderImage = showSliderImage.filter((item) => item != data.id);
    }
    writeFileData([...new Set(showSliderImage)]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
