import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMapLocationDot, faBolt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

function Guide() {

      useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 py-4">

      {/* Title Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800">
          How to Use EV Bharat
        </h1>
        <p className="mt-4 text-gray-600">
          Follow these simple steps to find EV charging stations near you and contribute to the EV community.
        </p>
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 max-w-6xl mx-auto">

        {/* Step 1 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="text-green-500 text-3xl mb-4">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <h2 className="text-xl font-semibold">Search Location</h2>
          <p className="text-gray-600 mt-2">
            Enter your city, area, or station name in the search bar to find nearby EV charging stations.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="text-green-500 text-3xl mb-4">
            <FontAwesomeIcon icon={faMapLocationDot} />
          </div>
          <h2 className="text-xl font-semibold">View Stations</h2>
          <p className="text-gray-600 mt-2">
            Browse through the list of charging stations with details like location, charger type, and availability.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="text-green-500 text-3xl mb-4">
            <FontAwesomeIcon icon={faBolt} />
          </div>
          <h2 className="text-xl font-semibold">Check Charger Type</h2>
          <p className="text-gray-600 mt-2">
            Select stations based on charger type such as Fast Charging, CCS, or Type-2 connectors.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="text-green-500 text-3xl mb-4">
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <h2 className="text-xl font-semibold">Add Station</h2>
          <p className="text-gray-600 mt-2">
            Help the EV community by adding new charging stations using the "Add Station" button.
          </p>
        </div>

      </div>

      {/* Extra Info Section */}
      <div className="mt-20 max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Why Use EV Bharat?
        </h2>

        <ul className="mt-4 space-y-3 text-gray-600 list-disc list-inside">
          <li>Find EV charging stations across India.</li>
          <li>Quick search by city or area.</li>
          <li>View charger types and station details.</li>
          <li>Community driven station updates.</li>
        </ul>
      </div>

    </div>
  );
}

export default Guide;