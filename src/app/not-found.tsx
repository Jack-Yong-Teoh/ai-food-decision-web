import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__title">404 - Page Not Found</h1>
      <p className="not-found__message">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="not-found__link">
        Go Back To Homepage
      </Link>
    </div>
  );
}
