import { useState } from "react";

function ManageStations() {

  const [stations, setStations] = useState([
    { id: 1, name: "Green Charge Hub", location: "Mumbai", status: "Active" },
    { id: 2, name: "EV Power Station", location: "Pune", status: "Pending" },
    { id: 3, name: "FastCharge Hub", location: "Delhi", status: "Active" }
  ]);

  const deleteStation = (id) => {
    setStations(stations.filter((station) => station.id !== id));
  };

  const toggleStatus = (id) => {
    setStations(
      stations.map((station) =>
        station.id === id
          ? {
              ...station,
              status: station.status === "Active" ? "Offline" : "Active"
            }
          : station
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Manage Charging Stations
        </h1>

        <div className="bg-white rounded-lg shadow p-6">

          {stations.map((station) => (
            <div
              key={station.id}
              className="flex justify-between items-center border-b py-4"
            >

              <div>
                <h2 className="font-semibold">{station.name}</h2>
                <p className="text-gray-500 text-sm">
                  {station.location}
                </p>
                <p className="text-sm">
                  Status: {station.status}
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => toggleStatus(station.id)}
                  className="px-3 py-1 bg-yellow-400 rounded"
                >
                  Toggle Status
                </button>

                <button
                  onClick={() => deleteStation(station.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default ManageStations;
