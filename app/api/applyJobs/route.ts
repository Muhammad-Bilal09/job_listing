import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("application/")) {
      cb(null, true);
    } else {
      cb(new Error("Only document files are allowed"));
    }
  },
});

async function runMiddleware(req: any, res: any, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        console.error("Middleware error:", result);
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export const config = {
  runtime: "nodejs",
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const stream = Readable.from(buffer);

    const reqAny: any = stream;
    reqAny.headers = Object.fromEntries(req.headers);
    reqAny.method = req.method;
    reqAny.body = {};

    await runMiddleware(reqAny, {}, upload.single("resume"));

    console.log("Request Body:", reqAny.body);
    console.log("Request File:", reqAny.file);

    const { job_id, user_id } = reqAny.body;
    const resumeFile = reqAny.file;

    if (!job_id || !user_id || !resumeFile || !resumeFile.buffer) {
      return NextResponse.json(
        { error: "Job ID, User ID, and Resume are required" },
        { status: 400 }
      );
    }

    const cloudinaryResponse: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: "job-portal/resumes",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(resumeFile.buffer);
    });

    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      throw new Error("Cloudinary upload failed");
    }
    const application = await prisma.application.create({
      data: {
        resume: cloudinaryResponse.secure_url,
        status: "pending",
        job: {
          connect: {
            id: job_id,
          },
        },
        user: {
          connect: {
            id: user_id,
          },
        },
      },
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Application submission failed";
    console.error("Application error:", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
