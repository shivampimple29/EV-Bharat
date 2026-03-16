import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faLocationDot,
  faBolt,
  faClock
} from "@fortawesome/free-solid-svg-icons";

function RejectedStation() {

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);

    // API call for resubmitting station
    // axios.post("/api/station/resubmit", data)

    navigate("/verification"); 
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-6 flex justify-center">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">

        {/* Rejection Message */}
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
          <FontAwesomeIcon icon={faCircleExclamation} />
          <div>
            <h2 className="font-semibold">Station Rejected</h2>
            <p className="text-sm">
              Reason: Incorrect location or incomplete charger information.
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6">
          Edit & Resubmit Charging Station
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Station Name */}
          <div>
            <label className="font-medium">Station Name</label>
            <input
              {...register("stationName")}
              className="w-full border rounded-lg p-3 mt-1"
              placeholder="Enter station name"
            />
          </div>

          {/* Location */}
          <div>
            <label className="font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} />
              Address
            </label>
            <input
              {...register("address")}
              className="w-full border rounded-lg p-3 mt-1"
              placeholder="Enter station address"
            />
          </div>

          {/* Charger Type */}
          <div>
            <label className="font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faBolt} />
              Charger Type
            </label>
            <select
              {...register("chargerType")}
              className="w-full border rounded-lg p-3 mt-1"
            >
              <option value="">Select Charger</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="Type2">Type 2</option>
            </select>
          </div>

          {/* Open Hours */}
          <div>
            <label className="font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} />
              Opening Hours
            </label>
            <input
              {...register("hours")}
              className="w-full border rounded-lg p-3 mt-1"
              placeholder="e.g. 24 Hours"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Resubmit Station
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-300 px-6 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default RejectedStation;