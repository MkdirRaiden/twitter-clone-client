import { Link } from "react-router-dom";
import { MdOutlineErrorOutline } from "react-icons/md";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4 text-center">
      <MdOutlineErrorOutline className="text-red-500 text-6xl animate-bounce mb-4" />
      <h1 className="text-5xl font-bold text-error">404</h1>
      <p className="text-xl mt-2 text-gray-500">Oops! Page not found.</p>
      <p className="text-sm text-gray-400 mb-6">
        The page you're looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn btn-primary text-white hover:scale-105 transition-transform"
      >
        ⬅ Back to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
