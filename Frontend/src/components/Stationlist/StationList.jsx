import { useNavigate } from "react-router-dom";
import { stations } from "../../assets/data";

function StationList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 bg-gray-100 px-6" id="station-list">

      <h1 className="text-3xl font-bold mb-8 text-center">
        EV Charging Stations
      </h1>

      <div className="max-w-4xl mx-auto space-y-4">

        {stations.map((station) => (
          <div
            key={station.id}
            onClick={() => navigate(`/station/${station.id}`)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-semibold">{station.name}</h2>
            <p className="text-gray-600">{station.location}</p>
            <p className="text-green-500">{station.charger}</p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default StationList;