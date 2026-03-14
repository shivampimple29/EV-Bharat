import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faStar,
  faBolt,
  faClock,
  faPlug,
} from "@fortawesome/free-solid-svg-icons";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useEffect, useRef } from "react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function StationDetail() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const lat = 19.076;
    const lng = 72.8777;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 6,
    });

    // blue user marker
    new mapboxgl.Marker({ color: "blue" }).setLngLat([lng, lat]).addTo(map);

    map.on("load", async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/stations/nearby?lat=${lat}&lng=${lng}&radius=5000000000`,
        );

        const result = await response.json();

        console.log("API DATA:", result);

        const stations = result.stations;

        stations.forEach((station) => {
          const coordinates = station.location.coordinates;

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
  <div style="font-family:sans-serif">
    <h3 style="font-weight:600">${station.name}</h3>
    <p style="font-size:13px;color:gray">
      ${station.operator || "Unknown Operator"}
    </p>
    <a href="/station/${station._id}" 
       style="color:#16a34a;font-weight:600">
       View Details →
    </a>
  </div>
`);

          new mapboxgl.Marker({ color: "green" })
            .setLngLat([coordinates[0], coordinates[1]])
            .setPopup(popup)
            .addTo(map);
        });
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

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
    facilities: ["Restrooms", "Coffee Shop", "Waiting Area"],
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

          <p className="text-gray-500 mt-2">Operated by {station.operator}</p>

          <div className="flex items-center gap-2 text-gray-600 mt-3">
            <FontAwesomeIcon icon={faLocationDot} />
            {station.location}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
            {station.rating} ({station.reviews} reviews)
          </div>

          <div className="flex justify-between mt-4 text-gray-700">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBolt} className="text-green-500" />
              {station.charger}
            </div>

            <div>{station.distance}</div>
          </div>

          <div className="flex justify-between mt-3 text-gray-700">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPlug} />
              {station.slots}
            </div>

            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} />
              24/7
            </div>
          </div>

          <h2 className="text-blue-600 text-2xl font-bold mt-6">
            {station.price}
          </h2>

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
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Location Map</h2>

            <div ref={mapContainer} className="h-80 w-full rounded-lg" />
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Charging Ports</h2>

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

          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>

            <div className="text-gray-500">No reviews yet</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationDetail;
