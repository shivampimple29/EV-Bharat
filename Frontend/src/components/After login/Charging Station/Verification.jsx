import { useNavigate } from "react-router-dom";

function Verification() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="bg-white shadow-xl rounded-xl p-10 max-w-xl text-center">

        <div className="text-green-500 text-6xl mb-4">✔</div>

        <h1 className="text-3xl font-bold">
          Station Submitted Successfully
        </h1>

        <p className="mt-4 text-gray-600">
          Thank you for helping grow the EV charging network.
        </p>

        <p className="mt-4 text-gray-600">
          Our team will verify the station information and location.
        </p>

        <p className="mt-4 text-gray-700 font-semibold">
          Verification will be completed within 30 days.
        </p>

        <p className="mt-4 text-gray-500">
          Once approved, the charging station will appear in the
          EV station list for all users.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          Go to Home
        </button>

      </div>

    </div>
  );
}

export default Verification;