import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import Img from "~/components/img";

import loader from "./loader";
import action from "./action";
export { loader, action };

export default function Upload() {
  const { origin, gallerie } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!fetcher.data?.success) return;
    formRef.current?.reset();
    setSuccessMessage(fetcher.data.success.message);
    const timer = setTimeout(() => setSuccessMessage(""), 2000);
    return () => clearTimeout(timer);
  }, [fetcher.data]);

  const handleImageSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const MaxSize = 1000 * 1000 * 1; // 1MB
    if (file.size > MaxSize) {
      alert("File size should be less than 1MB");
      e.target.value = "";
      return;
    }
  };

  return (
    <main>
      <article>
        <h2>Upload to S3 from server</h2>
        <fetcher.Form method="post" encType="multipart/form-data" ref={formRef}>
          <input
            type="file"
            name="image"
            accept="image/*"
            required
            onChange={handleImageSize}
          />
          <button data-primary disabled={fetcher.state !== "idle"}>
            Upload
          </button>
          {fetcher.state !== "idle" ? <label>Uploading...</label> : null}
          {fetcher.data?.error ? (
            <label style={{ color: "red" }}>{fetcher.data.error.message}</label>
          ) : null}
          {successMessage ? (
            <label style={{ color: "green" }}>{successMessage}</label>
          ) : null}
        </fetcher.Form>

        <h3>Gallery</h3>
        <section style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
          {gallerie?.map((item) => (
            <Img
              style={{ height: 100 }}
              key={item.Key}
              src={`${origin}/${item.Key}`}
            />
          ))}
        </section>
      </article>
    </main>
  );
}
