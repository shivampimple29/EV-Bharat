import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faBatteryFull, faTemperatureHigh, faClock } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

function ChargingTips() {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">

      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800">
          EV Charging Tips
        </h1>
        <p className="mt-4 text-gray-600">
          Follow these smart charging tips to improve battery life and get the best performance from your EV.
        </p>
      </div>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 max-w-6xl mx-auto">

        {/* Tip 1 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <FontAwesomeIcon icon={faBolt} className="text-green-500 text-3xl mb-4"/>
          <h2 className="text-xl font-semibold">Use Fast Chargers Carefully</h2>
          <p className="text-gray-600 mt-2">
            Fast charging is convenient but frequent use may reduce battery health. Use it mainly during long trips.
          </p>
        </div>

        {/* Tip 2 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <FontAwesomeIcon icon={faBatteryFull} className="text-green-500 text-3xl mb-4"/>
          <h2 className="text-xl font-semibold">Maintain 20% - 80%</h2>
          <p className="text-gray-600 mt-2">
            Keeping your battery between 20% and 80% helps extend battery life and improves efficiency.
          </p>
        </div>

        {/* Tip 3 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <FontAwesomeIcon icon={faTemperatureHigh} className="text-green-500 text-3xl mb-4"/>
          <h2 className="text-xl font-semibold">Avoid Extreme Heat</h2>
          <p className="text-gray-600 mt-2">
            High temperatures can damage batteries. Park your EV in shade while charging when possible.
          </p>
        </div>

        {/* Tip 4 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <FontAwesomeIcon icon={faClock} className="text-green-500 text-3xl mb-4"/>
          <h2 className="text-xl font-semibold">Charge Overnight</h2>
          <p className="text-gray-600 mt-2">
            Charging during off-peak hours or overnight can be cheaper and better for battery management.
          </p>
        </div>

      </div>

      {/* Extra Safety Section */}
      <div className="mt-20 max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          EV Charging Safety Tips
        </h2>

        <ul className="mt-4 space-y-3 text-gray-600 list-disc list-inside">
          <li>Always use certified EV charging stations.</li>
          <li>Check charging cable condition before plugging in.</li>
          <li>Do not charge in flooded or wet areas.</li>
          <li>Follow manufacturer charging guidelines.</li>
          <li>Unplug properly after charging is complete.</li>
        </ul>
      </div>

    </div>
  );
}

export default ChargingTips;