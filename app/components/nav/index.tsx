import { Link } from "@remix-run/react";

export default function Nav() {
  return (
    <nav
      style={{
        display: "flex",
        gap: "1rem",
        fontWeight: "bold",
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/upload">Upload</Link>
      <Link to="/uploadS3">Upload S3</Link>
    </nav>
  );
}
