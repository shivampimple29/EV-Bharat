import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StationCard from "./StationCard";

function StationList() {
  const navigate = useNavigate();

  const [filteredStations, setFilteredStations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userLoc, setUserLoc] = useState(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const debounceRef = useRef(null);
  const [chargerType, setChargerType] = useState("");
  const [minPower, setMinPower] = useState("");
  const [available, setAvailable] = useState(false);
  const [verified, setVerified] = useState(false);
  const [minRating, setMinRating] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    if (query) {
      setSearch(query);
    }
  }, [query]);

  // ── Get GPS once on mount ─────────────────────────────────────────
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLoc(null)
    );
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // ── Build params — filters always sent regardless of mode ─────
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (chargerType.trim()) params.set("chargerType", chargerType.trim());
        if (minPower) params.set("minPower", minPower);
        if (available) params.set("available", "true");
        if (verified) params.set("verified", "true");
        if (minRating) params.set("minRating", minRating);
        if (city.trim()) params.set("city", city.trim());
        if (state.trim()) params.set("state", state.trim());
        params.set("sortBy", sortBy);

        // ── GPS coords injected into same endpoint ────────────────────
        if (userLoc && !search.trim()) {
          params.set("lat", userLoc.lat);
          params.set("lng", userLoc.lng);
          params.set("radius", "200000");
        }

        const response = await fetch(
          `https://ev-bharat-backend-j5s4.onrender.com/api/stations?${params}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        if (data && data.stations) {
          setFilteredStations(data.stations);
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setLoading(false);
      }
    }, search.trim() ? 400 : 0);

    return () => clearTimeout(debounceRef.current);
  }, [search, userLoc, chargerType, minPower, available, verified, minRating, city, state, sortBy]);
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

        {/* ── Filter Bar ───────────────────────────────────────────── */}
        <div className="flex items-center gap-2 my-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">

          {/* Charger Type */}
          <div className="relative">
            <select
              value={chargerType}
              onChange={(e) => setChargerType(e.target.value)}
              className={`text-xs pl-8 pr-6 h-9 rounded-full border font-semibold cursor-pointer appearance-none
        transition-all duration-200 outline-none shadow-sm
        ${chargerType
                  ? "bg-gradient-to-t from-emerald-400 to-teal-600 text-white border-transparent shadow-emerald-200 shadow-md"
                  : "bg-white text-gray-500 border-gray-200 hover:border-emerald-400 hover:shadow-md"
                }`}
            >
              <option value="">Charger Type</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="Type 2">Type 2</option>
              <option value="AC">AC</option>
              <option value="DC">DC</option>
            </select>
            <i className={`fa-solid fa-bolt absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] z-10 pointer-events-none
      ${chargerType
                ? "text-white"
                : "bg-gradient-to-t from-emerald-400 to-teal-600 bg-clip-text text-transparent"
              }`} />
            <span className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]
      ${chargerType ? "text-white" : "text-gray-400"}`}>▾</span>
          </div>

          {/* Min Power */}
          <div className="relative">
            <select
              value={minPower}
              onChange={(e) => setMinPower(e.target.value)}
              className={`text-xs pl-7 pr-6 py-2 rounded-full border font-semibold cursor-pointer appearance-none
        transition-all duration-200 outline-none shadow-sm
        ${minPower
                  ? "bg-gradient-to-t from-emerald-400 to-teal-600 text-white border-transparent shadow-emerald-200 shadow-md"
                  : "bg-white text-gray-500 border-gray-200 hover:border-emerald-400 hover:shadow-md"
                }`}
            >
              <option value="">Any Power</option>
              <option value="7.4">7.4 kW+</option>
              <option value="22">22 kW+</option>
              <option value="50">50 kW+ (Fast)</option>
              <option value="100">100 kW+ (Ultra Fast)</option>
            </select>
            <i className={`fa-solid fa-plug absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none
      ${minPower
                ? "text-white"
                : "bg-gradient-to-t from-emerald-400 to-teal-600 bg-clip-text text-transparent"
              }`} />
            <span className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]
      ${minPower ? "text-white" : "text-gray-400"}`}>▾</span>
          </div>

          {/* Min Rating */}
          <div className="relative">
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className={`text-xs pl-7 pr-6 py-2 rounded-full border font-semibold cursor-pointer appearance-none
        transition-all duration-200 outline-none shadow-sm
        ${minRating
                  ? "bg-gradient-to-t from-emerald-400 to-teal-600 text-white border-transparent shadow-emerald-200 shadow-md"
                  : "bg-white text-gray-500 border-gray-200 hover:border-emerald-400 hover:shadow-md"
                }`}
            >
              <option value="">Any Rating</option>
              <option value="3">3⭐ & above</option>
              <option value="4">4⭐ & above</option>
              <option value="4.5">4.5⭐ & above</option>
            </select>
            <i className={`fa-solid fa-star absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none
      ${minRating
                ? "text-white"
                : "bg-gradient-to-t from-emerald-400 to-teal-600 bg-clip-text text-transparent"
              }`} />
            <span className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]
      ${minRating ? "text-white" : "text-gray-400"}`}>▾</span>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`text-xs pl-7 pr-6 py-2 rounded-full border font-semibold cursor-pointer appearance-none
        transition-all duration-200 outline-none shadow-sm
        ${sortBy !== "rating"
                  ? "bg-gradient-to-t from-emerald-400 to-teal-600 text-white border-transparent shadow-emerald-200 shadow-md"
                  : "bg-white text-gray-500 border-gray-200 hover:border-emerald-400 hover:shadow-md"
                }`}
            >
              <option value="rating">Top Rated</option>
              <option value="newest">Newest First</option>
            </select>
            <i className={`fa-solid fa-arrow-up-wide-short absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none
      ${sortBy !== "rating"
                ? "text-white"
                : "bg-gradient-to-t from-emerald-400 to-teal-600 bg-clip-text text-transparent"
              }`} />
            <span className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]
      ${sortBy !== "rating" ? "text-white" : "text-gray-400"}`}>▾</span>
          </div>

          {/* Available Now */}
          <button
            onClick={() => setAvailable((p) => !p)}
            className={`text-xs px-3.5 py-2 rounded-full border font-semibold
      transition-all duration-200 flex items-center gap-1.5 shadow-sm
      ${available
                ? "bg-gradient-to-t from-emerald-400 to-teal-600 text-white border-transparent shadow-emerald-200 shadow-md scale-[1.04]"
                : "bg-white text-gray-500 border-gray-200 hover:border-emerald-400 hover:shadow-md"
              }`}
          >
            <i className={`fa-solid fa-circle-check text-[10px]
      ${available
                ? "text-white animate-pulse"
                : "bg-gradient-to-t from-emerald-400 to-teal-600 bg-clip-text text-transparent"
              }`} />
            Available Now
          </button>

          {/* Verified Only */}
          <button
            onClick={() => setVerified((p) => !p)}
            className={`text-xs px-3.5 py-2 rounded-full border font-semibold
      transition-all duration-200 flex items-center gap-1.5 shadow-sm
      ${verified
                ? "bg-gradient-to-t from-emerald-400 to-teal-600 text-white border-transparent shadow-emerald-200 shadow-md scale-[1.04]"
                : "bg-white text-gray-500 border-gray-200 hover:border-emerald-400 hover:shadow-md"
              }`}
          >
            <i className={`fa-solid fa-shield-halved text-[11px]
      ${verified
                ? "text-white"
                : "bg-gradient-to-t from-emerald-400 to-teal-600 bg-clip-text text-transparent"
              }`} />
            Verified Only
          </button>

          {/* Reset — only visible when any filter is active */}
          {(chargerType || minPower || minRating || available || verified || sortBy !== "rating") && (
            <button
              onClick={() => {
                setChargerType("");
                setMinPower("");
                setMinRating("");
                setAvailable(false);
                setVerified(false);
                setSortBy("rating");
              }}
              className="text-xs px-3.5 py-2 rounded-full border border-rose-300 text-rose-400
        bg-white hover:bg-rose-50 hover:text-rose-500 font-semibold
        transition-all duration-200 flex items-center gap-1.5 shadow-sm"
            >
              <i className="fa-solid fa-xmark text-[11px]" />
              Reset
            </button>
          )}

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
            stations
          </p>
        </div>

        {/* Station Cards */}
        <div
          className={`space-y-4 transition-all duration-300
                     "opacity-100 translate-y-0"
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
      </div>
    </div>
  );
}

export default StationList;
