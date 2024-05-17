import { type UploadHandler } from "@remix-run/node";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import asyncIterableToBuffer from "~/utils/asyncIterableToBuffer";

export const s3Client = new S3Client();

//  LIST S3 OBJECTS
export const listStorageObjects = async () => {
  try {
    return await s3Client.send(
      new ListObjectsV2Command({
        Bucket: `${process.env.APP_NAME}-${process.env.BRANCH_NAME}-storage`,
      })
    );
  } catch (error) {
    console.error("listStorageObjects : ", error);
    return null;
  }
};

// S3 SIGNED URL
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import removeSpecialCharacters from "~/utils/removeSpecialCharacters";

export const S3SignedUrl = async (filename: string) => {
  const key = removeSpecialCharacters(filename);

  try {
    const command = new PutObjectCommand({
      Bucket: `${process.env.APP_NAME}-${process.env.BRANCH_NAME}-storage`,
      Key: `storage/${key}`,
    });
    return await getSignedUrl(s3Client, command, {
      expiresIn: 5 * 60,
    });
  } catch (error) {
    console.error("S3SignedUrl : ", error);
    return null;
  }
};

//  UPLOAD FILE TO S3
export const S3UploadHandler: UploadHandler = async ({
  name,
  filename,
  contentType,
  data,
}) => {
  if (!filename || !data) return null;
  //const buffer = await asyncIterableToBuffer(data);
  //if (buffer.length > 1024 * 1024)
  //  throw new Error("File size should be less than 1MB");

  const key = removeSpecialCharacters(filename);

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: `${process.env.APP_NAME}-${process.env.BRANCH_NAME}-storage`,
        Key: `storage/${key}`,
        Body: await asyncIterableToBuffer(data),
        // Body: buffer,
      })
    );
    return `storage/${key}`;
  } catch (error) {
    console.error("S3UploadHandler : ", error);
    return null;
  }
};

// //  UPLOAD FILE TO S3 USING LIB-STORAGE

// import { Upload } from "@aws-sdk/lib-storage";

// export const upload: UploadHandler = async ({
//   name,
//   filename,
//   contentType,
//   data,
// }) => {
//   if (!filename || !data) return null;
//   try {
//     const upload = new Upload({
//       params: {
//         Bucket: `${process.env.APP_NAME}-${process.env.BRANCH_NAME}-storage`,
//         Key: "storage/" + filename.replaceAll(" ", "_"),
//         Body: await asyncIterableToBuffer(data),
//       },
//       client: s3Client,
//       queueSize: 3,
//     });

//     upload.on("httpUploadProgress", (progress) => {
//       console.log("httpUploadProgress", progress);
//     });

//     await upload.done();
//     return filename.replaceAll(" ", "_");
//   } catch (error) {
//     console.error("lib-storage upload : ", error);
//     return null;
//   }
// };

// // UPLOAD FILE TO S3 USING NODE STREAM
//
// import type { UploadHandler } from "@remix-run/node";
// import { writeAsyncIterableToWritable } from "@remix-run/node";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { PassThrough } from "stream";

// const s3 = new S3Client();

// export const S3UploadHandler: UploadHandler = async ({
//   name,
//   filename,
//   contentType,
//   data,
// }) => {
//   if (!filename || !data) return null;

//   const pass = new PassThrough();
//   await writeAsyncIterableToWritable(data, pass);

//   s3.send(
//     new PutObjectCommand({
//       Bucket: `${process.env.APP_NAME}-${process.env.BRANCH_NAME}-storage`,
//       Key: filename,
//       // Body: pass,
//     })
//   );
//   return filename.replaceAll(" ", "_");
// };
