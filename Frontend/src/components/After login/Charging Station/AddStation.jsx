import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faLocationDot,
  faBuilding,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

function AddStation() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [chargerType, setChargerType] = useState("fast");
  const [connectors, setConnectors] = useState([]);

  const connectorList = [
    "CCS2",
    "CHAdeMO",
    "Type 2",
    "Bharat AC",
    "Bharat DC",
    "GB/T",
    "Tesla",
  ];

  const toggleConnector = (type) => {
    if (connectors.includes(type)) {
      setConnectors(connectors.filter((c) => c !== type));
    } else {
      setConnectors([...connectors, type]);
    }
  };

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      chargerType,
      connectors,
    };

    console.log(finalData);

    navigate("/verification");
  };

    useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-green-500 text-white p-3 rounded-xl">
            <FontAwesomeIcon icon={faPlus} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Add New Station</h2>
            <p className="text-gray-500 text-sm">
              Help the EV community by adding a new charging station.
            </p>
          </div>
        </div>

        <hr className="mb-6" />

        {/* Station Name */}
        <label className="font-medium">Station Name *</label>
        <div className="flex items-center border rounded-xl p-3 mt-2 mb-4">
          <FontAwesomeIcon icon={faBuilding} className="text-gray-400 mr-3" />
          <input
            {...register("stationName", { required: true })}
            className="w-full outline-none"
            placeholder="e.g., Tata Power Charging Hub"
          />
        </div>

        {/* Address */}
        <label className="font-medium">Full Address *</label>
        <div className="flex items-center border rounded-xl p-3 mt-2 mb-4">
          <FontAwesomeIcon
            icon={faLocationDot}
            className="text-gray-400 mr-3"
          />
          <input
            {...register("address", { required: true })}
            className="w-full outline-none"
            placeholder="Street address, landmark..."
          />
        </div>

        {/* City */}
        <label className="font-medium">City *</label>
        <select
          {...register("city")}
          className="w-full border p-3 rounded-xl mt-2 mb-4"
        >
          <option>Select a city</option>
          <option>Mumbai</option>
          <option>Pune</option>
          <option>Delhi</option>
          <option>Bangalore</option>
        </select>

        {/* Network */}
        <label className="font-medium">Network / Operator</label>
        <input
          {...register("network")}
          className="w-full border p-3 rounded-xl mt-2 mb-6"
          placeholder="e.g., Tata Power, Ather, EESL"
        />

        {/* Charger Type */}
        <label className="font-medium">Charger Type</label>

        <div className="flex gap-3 mt-3 mb-6">
          <button
            type="button"
            onClick={() => setChargerType("fast")}
            className={`px-6 py-2 rounded-full ${
              chargerType === "fast" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            ⚡ Fast
          </button>

          <button
            type="button"
            onClick={() => setChargerType("slow")}
            className={`px-6 py-2 rounded-full ${
              chargerType === "slow" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            🔋 Slow
          </button>

          <button
            type="button"
            onClick={() => setChargerType("both")}
            className={`px-6 py-2 rounded-full ${
              chargerType === "both" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            ⚡ Both
          </button>
        </div>

        {/* Connector Types */}

        <label className="font-medium">Connector Types</label>

        <div className="flex flex-wrap gap-3 mt-3 mb-6">
          {connectorList.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleConnector(c)}
              className={`px-4 py-2 rounded-full text-sm ${
                connectors.includes(c)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Operating Hours */}

        <label className="font-medium">Operating Hours</label>

        <div className="flex items-center border rounded-xl p-3 mt-2 mb-6">
          <FontAwesomeIcon icon={faClock} className="text-gray-400 mr-3" />
          <input
            {...register("hours")}
            className="w-full outline-none"
            placeholder="24/7"
          />
        </div>

        {/* Submit */}

        <button
          type="submit"
          className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-green-500 to-teal-500"
        >
          Submit Station
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Submitted stations are reviewed before being added to the map.
        </p>
      </form>
    </div>
  );
}

export default AddStation;
