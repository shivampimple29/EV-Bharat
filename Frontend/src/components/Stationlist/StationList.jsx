
import { useState } from "react";
import { stations } from "../../assets/data";
import StationCard from "../Stationlist/StationCard";

function StationList() {

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredStations = stations.filter((station) => {

    const matchesSearch =
      station.name.toLowerCase().includes(search.toLowerCase()) ||
      station.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || station.level === filter;

    return matchesSearch && matchesFilter;

  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6">

      <div className="max-w-5xl mx-auto">

        {/* Search */}
        <input
          type="text"
          placeholder="Search charging stations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 mb-4 text-sm sm:text-base"
        />

        {/* Filters */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">

          <button
            onClick={() => setFilter("Level 1")}
            className={`border px-4 py-2 rounded-lg whitespace-nowrap ${
              filter === "Level 1" ? "bg-green-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            Level 1
          </button>

          <button
            onClick={() => setFilter("Level 2")}
            className={`border px-4 py-2 rounded-lg whitespace-nowrap ${
              filter === "Level 2" ? "bg-green-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            Level 2
          </button>

          <button
            onClick={() => setFilter("DC Fast")}
            className={`border px-4 py-2 rounded-lg whitespace-nowrap ${
              filter === "DC Fast" ? "bg-green-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            DC Fast
          </button>

          <button
            onClick={() => setFilter("All")}
            className={`border px-4 py-2 rounded-lg whitespace-nowrap ${
              filter === "All" ? "bg-green-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            All
          </button>

        </div>

        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          {filteredStations.length} charging stations found
        </p>

        {/* Station List */}
        <div className="space-y-4">

          {filteredStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
            />
          ))}

        </div>

      </div>

    </div>
  );
}

export default StationList;

