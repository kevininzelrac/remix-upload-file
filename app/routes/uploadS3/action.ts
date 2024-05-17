import { ActionFunctionArgs, json } from "@remix-run/node";
import { S3SignedUrl } from "~/services/s3.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const signedUrl = await S3SignedUrl(String(formData.get("key")));
  if (!signedUrl)
    return json({
      error: { message: "Woops, something went wrong !!" },
      url: null,
    });

  return json({
    error: null,
    url: signedUrl,
  });
};
export default action;
