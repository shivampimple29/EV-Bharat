import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faStar,
  faBolt,
  faClock,
  faPlug
} from "@fortawesome/free-solid-svg-icons";

function StationDetail() {
  const station = {
    name: "EcoPlug Station",
    operator: "EVgo India",
    location: "Connaught Place, Delhi",
    rating: "4.8",
    reviews: "210",
    distance: "0.8 km",
    charger: "DC Fast",
    slots: "2 / 2 slots available",
    price: "40 RS/Kwatt",
    facilities: ["Restrooms", "Coffee Shop", "Waiting Area"]
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-10 pb-5 px-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div className="bg-white rounded-xl p-8 shadow">

          <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm">
            Available
          </span>

          <h1 className="text-3xl font-bold mt-4">{station.name}</h1>

          <p className="text-gray-500 mt-2">
            Operated by {station.operator}
          </p>

          <div className="flex items-center gap-2 text-gray-600 mt-3">
            <FontAwesomeIcon icon={faLocationDot}/>
            {station.location}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500"/>
            {station.rating} ({station.reviews} reviews)
          </div>

          <div className="flex justify-between mt-4 text-gray-700">

            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBolt} className="text-green-500"/>
              {station.charger}
            </div>

            <div>{station.distance}</div>
          </div>

          <div className="flex justify-between mt-3 text-gray-700">

            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPlug}/>
              {station.slots}
            </div>

            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock}/>
              24/7
            </div>

          </div>

          <h2 className="text-blue-600 text-2xl font-bold mt-6">
            {station.price}
          </h2>

          {/* Facilities */}
          <div className="flex gap-3 mt-6 flex-wrap">

            {station.facilities.map((item, index) => (
              <span
                key={index}
                className="bg-gray-200 px-4 py-2 rounded-lg text-sm"
              >
                {item}
              </span>
            ))}

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* Map */}
          <div className="bg-white rounded-xl p-6 shadow">

            <h2 className="text-xl font-semibold mb-4">
              Location Map
            </h2>

            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
              Map will appear here
            </div>

          </div>

          {/* Charging Ports */}
          <div className="bg-white rounded-xl p-6 shadow">

            <h2 className="text-xl font-semibold mb-4">
              Charging Ports
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between border-b pb-3">
                <div>
                  <h3 className="font-semibold">CCS</h3>
                  <p className="text-gray-500 text-sm">120 kW</p>
                </div>

                <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm">
                  Available
                </span>
              </div>

              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">CCS</h3>
                  <p className="text-gray-500 text-sm">120 kW</p>
                </div>

                <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm">
                  Available
                </span>
              </div>

            </div>

          </div>

          {/* Reviews */}
          <div className="bg-white rounded-xl p-6 shadow">

            <h2 className="text-xl font-semibold mb-4">
              Reviews
            </h2>

            <div className="text-gray-500">
              No reviews yet
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StationDetail;