import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-8xl font-heading font-extrabold text-primary">404</h1>
      <p className="mt-4 text-text-secondary">Page not found.</p>
      <Link to="/" className="mt-6 bg-primary text-black px-6 py-3 rounded-lg">Go Home</Link>
    </div>
  );
}