import { useFetcher, useLoaderData, useRevalidator } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import Img from "~/components/img";

import loader from "./loader";
import action from "./action";
export { loader, action };

export default function Upload() {
  const { origin, gallerie } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const revalidator = useRevalidator();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      if (!fetcher.data?.url || !inputRef.current || !inputRef.current.files)
        return;

      try {
        setLoading(true);
        await fetch(fetcher.data.url, {
          method: "PUT",
          headers: { "Content-Type": "multipart/form-data" },
          body: inputRef.current.files[0],
        });
        revalidator.revalidate();
        inputRef.current!.value = "";
        setSuccess("image uploaded successfully!");
        const timer = setTimeout(() => setSuccess(""), 2000);
        return () => clearTimeout(timer);
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetcher.data?.url]);

  const handleUpload = () => {
    if (!inputRef.current || !inputRef.current.files) return;
    fetcher.submit(
      { key: inputRef.current.files[0].name },
      { method: "POST", encType: "multipart/form-data" }
    );
  };

  return (
    <main>
      <article>
        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Upload to S3 from client using pre signed url</h2>
          <input
            ref={inputRef}
            type="file"
            name="image"
            accept="image/*"
            required
          />
          <button data-primary onClick={handleUpload}>
            Upload
          </button>
          {loading ? <label>Uploading...</label> : null}
          {error ? <label style={{ color: "crimson" }}>{error}</label> : null}
          {success ? <label style={{ color: "green" }}>{success}</label> : null}
        </form>

        <br />
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
