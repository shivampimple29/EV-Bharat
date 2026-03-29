import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StationCard from "./StationCard";

function StationList() {
  const navigate = useNavigate();


  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalStations, setTotalStations] = useState(0);
  const [pageTransition, setPageTransition] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const limit = 20;

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8000/api/stations?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data && data.stations) {
          setStations(data.stations);
          setFilteredStations(data.stations);
          setTotalStations(data.total);
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setLoading(false);
        setTimeout(() => setPageTransition(false), 100);
      }
    };
    fetchStations();
  }, [page]);

  useEffect(() => {
    if (!search) {
      setFilteredStations(stations);
      return;
    }
    const result = stations.filter((station) =>
      station.name?.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredStations(result);
  }, [search, stations]);

  const totalPages = Math.ceil(totalStations / limit);

  const handlePageChange = (newPage) => {
    setPageTransition(true);
    setTimeout(() => setPage(newPage), 200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="relative w-14 h-14 mb-5">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-200" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent
                          border-t-emerald-500 animate-spin"
          />
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent
                          border-t-teal-400 animate-spin [animation-duration:0.5s]"
          />
        </div>
        <p className="text-emerald-600 text-xs font-bold tracking-widest uppercase animate-pulse">
          Loading charging stations...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-14 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-8 animate-[fadeInUp_0.4s_ease_forwards]">
          <h1 className="text-3xl font-bold text-gray-900">
            EV Charging{" "}
            <span
              className="bg-gradient-to-r from-emerald-500 to-teal-600
                             bg-clip-text text-transparent"
            >
              Stations
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Find the nearest charging point around you.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 group animate-[fadeInUp_0.45s_ease_forwards]">
          {/* Glow ring on focus */}
          <div
            className={`absolute -inset-0.5 rounded-xl
                          bg-gradient-to-r from-emerald-400 to-teal-600
                          blur transition-all duration-500 ease-in-out
                          ${searchFocused ? "opacity-40 scale-100" : "opacity-0 scale-95"}`}
          />

          <div
            className={`relative flex items-center bg-white rounded-xl
                          border transition-all duration-300 ease-in-out shadow-sm
                          ${searchFocused
                ? "border-emerald-400 shadow-emerald-100 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
          >
            {/* Search Icon */}
            <div
              className={`ml-4 transition-all duration-300
                            ${searchFocused ? "text-emerald-500 scale-110" : "text-gray-400"}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Search nearby stations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full bg-transparent px-4 py-3 text-gray-800
                         placeholder:text-gray-400 text-sm outline-none
                         transition-all duration-200"
            />

            {/* Clear button */}
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mr-3 w-6 h-6 rounded-full bg-gray-100
                           flex items-center justify-center
                           text-gray-400 hover:text-gray-600 hover:bg-gray-200
                           hover:scale-110 active:scale-95
                           transition-all duration-200
                           animate-[fadeInUp_0.15s_ease_forwards]"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Count */}
        <div
          className="flex items-center justify-between mb-6
                        animate-[fadeInUp_0.5s_ease_forwards]"
        >
          <p className="text-gray-400 text-sm">
            Showing{" "}
            <span className="text-emerald-600 font-semibold">
              {filteredStations.length}
            </span>{" "}
            of{" "}
            <span className="text-gray-700 font-semibold">{totalStations}</span>{" "}
            stations
          </p>
          <p className="text-gray-400 text-xs">
            Page <span className="text-gray-600 font-semibold">{page}</span> of{" "}
            <span className="text-gray-600 font-semibold">{totalPages}</span>
          </p>
        </div>

        {/* Station Cards */}
        <div
          className={`space-y-4 transition-all duration-300
                         ${pageTransition
              ? "opacity-0 translate-y-2"
              : "opacity-100 translate-y-0"
            }`}
        >
          {filteredStations.length > 0 ? (
            filteredStations.map((station, index) => (
              <div
                key={station._id}
                className="opacity-0 animate-[fadeInUp_0.4s_ease_forwards]
                           hover:-translate-y-0.5 transition-transform duration-200"
                style={{ animationDelay: `${index * 35}ms` }}
              >
                <StationCard
                  station={station}
                  onClick={() => navigate(`/stations/${station._id}`)}
                />
              </div>
            ))
          ) : (
            <div
              className="flex flex-col items-center justify-center py-24 text-center
                            animate-[fadeInUp_0.3s_ease_forwards]"
            >
              <div
                className="w-16 h-16 rounded-2xl bg-white border border-gray-200
                              shadow-sm flex items-center justify-center mb-4
                              animate-pulse"
              >
                <svg
                  className="w-7 h-7 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-semibold">No stations found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try a different search term
              </p>
              <button
                onClick={() => setSearch("")}
                className="mt-4 px-4 py-2 rounded-xl text-sm font-medium
                           bg-gradient-to-r from-emerald-500 to-teal-600
                           text-white shadow-sm
                           hover:shadow-md hover:scale-105 active:scale-95
                           transition-all duration-200"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex justify-center items-center gap-3 mt-10
                          animate-[fadeInUp_0.6s_ease_forwards]"
          >
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-white border border-gray-200 text-gray-600 text-sm font-medium
                         shadow-sm hover:border-emerald-400 hover:text-emerald-600
                         hover:shadow-md hover:-translate-x-0.5
                         disabled:opacity-40 disabled:cursor-not-allowed
                         disabled:hover:translate-x-0 disabled:hover:shadow-sm
                         disabled:hover:border-gray-200 disabled:hover:text-gray-600
                         transition-all duration-300 active:scale-95"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300
                             group-hover:-translate-x-0.5 group-disabled:translate-x-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum =
                  totalPages <= 5
                    ? i + 1
                    : page <= 3
                      ? i + 1
                      : page >= totalPages - 2
                        ? totalPages - 4 + i
                        : page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold
                                transition-all duration-200 active:scale-90
                                ${page === pageNum
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200 scale-105"
                        : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-400 hover:text-emerald-600 hover:scale-105"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-white border border-gray-200 text-gray-600 text-sm font-medium
                         shadow-sm hover:border-emerald-400 hover:text-emerald-600
                         hover:shadow-md hover:translate-x-0.5
                         disabled:opacity-40 disabled:cursor-not-allowed
                         disabled:hover:translate-x-0 disabled:hover:shadow-sm
                         disabled:hover:border-gray-200 disabled:hover:text-gray-600
                         transition-all duration-300 active:scale-95"
            >
              Next
              <svg
                className="w-4 h-4 transition-transform duration-300
                             group-hover:translate-x-0.5 group-disabled:translate-x-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StationList;
