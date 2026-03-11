import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faHome } from "@fortawesome/free-solid-svg-icons";

function NotFound() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-6">

      {/* Icon */}
      <div className="text-yellow-500 text-6xl mb-4">
        <FontAwesomeIcon icon={faBolt} />
      </div>

      {/* 404 Text */}
      <h1 className="text-7xl font-bold text-gray-800 mb-2">404</h1>

      <h2 className="text-2xl font-semibold text-gray-700 mb-3">
        Page Not Found
      </h2>

      <p className="text-gray-500 text-center max-w-md mb-6">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow"
      >
        <FontAwesomeIcon icon={faHome} />
        Go to Home
      </button>

    </div>
  );
}

export default NotFound;