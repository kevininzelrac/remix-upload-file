import { json } from "@remix-run/node";
import { listStorageObjects } from "~/services/s3.server";

const loader = async () => {
  const origin = process.env.ORIGIN;

  const gallerie = await listStorageObjects();

  // SORT BY DESCENDING DATE
  if (gallerie?.Contents) {
    gallerie.Contents.sort((a: any, b: any) => b.LastModified - a.LastModified);
  }

  return json({ origin, gallerie: gallerie?.Contents });
};
export default loader;
