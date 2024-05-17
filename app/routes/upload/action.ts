import {
  json,
  ActionFunctionArgs,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { S3UploadHandler } from "~/services/s3.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    await parseMultipartFormData(request, S3UploadHandler);
    // const filename = String(formData.get("file"));
    // return json(`${process.env.ORIGIN}/storage/${filename}`);
    return json({
      error: null,
      success: { message: "file successfully uploaded" },
    });
  } catch (error: any) {
    console.error("Action ", error);
    return json({
      success: null,
      error: { message: error.message },
    });
  }
};
export default action;
