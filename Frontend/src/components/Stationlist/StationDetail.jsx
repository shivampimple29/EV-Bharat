import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot, faStar, faBolt, faPlug, faBuilding,
  faWifi, faParking, faUtensils, faShield, faRestroom,
  faCircleCheck, faClock, faIndianRupeeSign, faChevronLeft,
  faImage, faRoute,
} from "@fortawesome/free-solid-svg-icons";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MapView from "./MapView";

const facilityIconMap = {
  wifi: faWifi,
  parking: faParking,
  cafe: faUtensils,
  food: faUtensils,
  security: faShield,
  restroom: faRestroom,
  toilet: faRestroom,
};

const chargerTypeColors = {
  CCS: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  CCS2: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  CHAdeMO: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
  Type2: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
  AC: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700" },
  DC: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
};

function StationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ports");
  const [imgError, setImgError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [navMode, setNavMode] = useState(false);   // ← NEW

  useEffect(() => {
    window.scrollTo(0, 0);
    setVisible(false);
    setNavMode(false);   // reset nav when station changes

    const fetchStation = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/stations/${id}`);
        const result = await response.json();
        setStation(result.station || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setTimeout(() => setVisible(true), 50);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/stations/${id}/reviews`);
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Reviews fetch error:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchStation();
    fetchReviews();
  }, [id]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-200 animate-ping opacity-30" />
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-teal-400 animate-spin [animation-duration:0.5s]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FontAwesomeIcon icon={faBolt} className="text-emerald-400 text-xs" />
          </div>
        </div>
        <p className="text-emerald-600 text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
          Loading Station...
        </p>
        <p className="text-gray-400 text-xs mt-1.5 tracking-wide">EV Bharat Network</p>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!station) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faBolt} className="text-gray-300 text-xl" />
          </div>
          <p className="text-gray-700 font-semibold">Station not found</p>
          <p className="text-gray-400 text-sm mt-1">This station may have been removed.</p>
          <button onClick={() => navigate(-1)}
            className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm hover:shadow-lg hover:shadow-emerald-100 hover:scale-105 active:scale-95 transition-all duration-200">
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const chargers = station.chargers || [];
  const totalPorts = chargers.reduce((sum, c) => sum + (c.totalPorts || 1), 0);
  const coverImage = !imgError && station.mediaItems?.[0]?.itemURL;
  const chargerTypes = [...new Set(chargers.map(c => c.type).filter(Boolean))];
  const maxPower = chargers.length ? Math.max(...chargers.map(c => c.power || 0)) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 mb-2 text-gray-400 hover:text-emerald-600 text-sm font-medium transition-all duration-200">
          <FontAwesomeIcon icon={faChevronLeft} className="text-xs transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Stations
        </button>

        {/* Main grid */}
        <div className={`flex flex-col lg:flex-row gap-6 items-start transition-all duration-700 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

          {/* ── LEFT PANEL 30% ──────────────────────────────────────────── */}
          <div className="w-full lg:w-[30%] flex flex-col gap-5">
            <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-emerald-50/80 hover:border-emerald-100 transition-all duration-300">

              {/* Accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />

              {/* Cover image */}
              {coverImage ? (
                <div className="relative w-full h-44 overflow-hidden">
                  <img src={coverImage} alt={station.name} onError={() => setImgError(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                </div>
              ) : (
                <div className="w-full h-28 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center border-b border-gray-100 group-hover:from-emerald-100 group-hover:to-teal-100 transition-all duration-500">
                  <FontAwesomeIcon icon={faImage} className="text-emerald-200 text-3xl group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-300" />
                </div>
              )}

              <div className="p-5">

                {/* Status + rating */}
                <div className="flex items-center justify-between mb-4">

                  {/* Operational */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold group-hover:bg-emerald-100 transition-colors duration-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Operational
                  </div>

                  {/* Max power badge */}
                  {maxPower > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-xs font-bold hover:bg-amber-100 transition-colors duration-200">
                      <FontAwesomeIcon icon={faBolt} className="text-[10px] leading-none" />
                      Up to {maxPower} kW
                    </div>
                  )}

                </div>

                {/* Name */}
                <h1 className="text-xl font-extrabold text-gray-900 leading-snug mb-1 group-hover:text-emerald-700 transition-colors duration-300">
                  {station.name}
                </h1>

                {/* Operator */}
                {station.operator && (
                  <p className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium mb-3">
                    <FontAwesomeIcon icon={faBuilding} className="text-xs text-emerald-400" />
                    {station.operator}
                  </p>
                )}

                {/* Location */}
                <p className="flex items-start gap-1.5 text-gray-400 text-sm mb-5">
                  <FontAwesomeIcon icon={faLocationDot} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    {[station.address?.city, station.address?.state, station.address?.country]
                      .filter(Boolean).join(", ") || "Location not available"}
                  </span>
                </p>

                <div className="h-px bg-gradient-to-r from-emerald-100/60 via-gray-100 to-teal-100/60 mb-5" />

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  {[
                    { icon: faPlug, value: chargerTypes.length || chargers.length, label: "Types", iconColor: "text-emerald-500", bg: "bg-emerald-50 border-emerald-100" },
                    { icon: faBolt, value: totalPorts, label: "Ports", iconColor: "text-teal-500", bg: "bg-teal-50 border-teal-100" },
                    { icon: faStar, value: station.averageRating ? `${station.averageRating.toFixed(1)}` : "N/A", label: "Rating", iconColor: "text-amber-400", bg: "bg-amber-50 border-amber-100" },
                  ].map(stat => (
                    <div key={stat.label}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border ${stat.bg} hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default`}>
                      <FontAwesomeIcon icon={stat.icon} className={`${stat.iconColor} mb-1.5 text-sm`} />
                      <span className="text-gray-800 font-bold text-base leading-none">{stat.value}</span>
                      <span className="text-gray-400 text-[9px] font-semibold mt-1 uppercase tracking-wider">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Price */}
                {station.pricePerUnit && (
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-3 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/60 hover:border-emerald-200 hover:shadow-sm transition-all duration-200">
                    <span className="flex items-center gap-2 text-gray-500 text-sm">
                      <FontAwesomeIcon icon={faIndianRupeeSign} className="text-emerald-500 text-xs" />
                      Charging Rate
                    </span>
                    <span className="text-emerald-600 font-bold text-sm">₹{station.pricePerUnit}/kWh</span>
                  </div>
                )}

                {/* Opening Hours */}
                {station.openingHours && (
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-5 bg-gray-50 border border-gray-100 hover:bg-gray-100/60 hover:border-gray-200 transition-all duration-200">
                    <span className="flex items-center gap-2 text-gray-500 text-sm">
                      <FontAwesomeIcon icon={faClock} className="text-gray-400 text-xs" />
                      Hours
                    </span>
                    <span className="text-gray-700 font-semibold text-sm">{station.openingHours}</span>
                  </div>
                )}

                {/* Facilities */}
                {station.facilities?.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">Facilities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {station.facilities.map((facility, i) => {
                        const icon = facilityIconMap[facility.toLowerCase()] || faCircleCheck;
                        return (
                          <div key={i}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 text-xs font-medium hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-600 hover:scale-105 transition-all duration-200 cursor-default">
                            <FontAwesomeIcon icon={icon} className="text-emerald-400 text-[9px]" />
                            <span className="capitalize">{facility}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL 70% ─────────────────────────────────────────── */}
          <div className="w-full lg:w-[70%] flex flex-col gap-5">

            {/* ── MAP + NAVIGATION SECTION ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-300">

              {/* Map header row with Get Directions button */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {navMode ? "Navigation" : "Station Location"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {navMode
                      ? "Route from your location to this station"
                      : `${[station.address?.city, station.address?.state].filter(Boolean).join(", ")}`}
                  </p>
                </div>

                <button
                  onClick={() => setNavMode(prev => !prev)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95
                    ${navMode
                      ? "bg-red-50 text-red-500 border border-red-100 hover:bg-red-100"
                      : "bg-gradient-to-t from-emerald-400 to-teal-600 text-white hover: shadow-sm hover:shadow-blue-200 cursor-pointer"
                    }`}
                >
                  <FontAwesomeIcon icon={faRoute} />
                  {navMode ? "Cancel" : "Get Directions"}
                </button>
              </div>

              {/* Map — expands when in nav mode */}
              <div className="w-full">
                <MapView
                  mapHeight={navMode ? "h-[300px]" : "h-64"}
                  destinationStation={navMode ? station : null}
                />
              </div>

            </div>

            {/* ── TABS ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-300">

              <div className="flex border-b border-gray-100 bg-gray-50/50">
                {[
                  { key: "ports", label: "Charging Ports", count: chargers.length },
                  { key: "reviews", label: "Reviews", count: reviews.length },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold relative transition-all duration-200
                      ${activeTab === tab.key ? "text-emerald-600 bg-white" : "text-gray-400 hover:text-gray-600 hover:bg-white/60"}`}>
                    {tab.label}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-200
                      ${activeTab === tab.key ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                      {tab.count}
                    </span>
                    <span className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-t-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300 ease-in-out
                      ${activeTab === tab.key ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`} />
                  </button>
                ))}
              </div>

              <div className="p-5">

                {/* ── Charging Ports ── */}
                {activeTab === "ports" && (
                  <div className="space-y-2.5">
                    {chargers.length > 0 ? (
                      chargers.map((charger, index) => {
                        const colors = chargerTypeColors[charger.type] || { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600" };
                        return (
                          <div key={index}
                            className="group/port flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-50 hover:-translate-y-0.5 transition-all duration-200 opacity-0 animate-[fadeInUp_0.4s_ease_forwards]"
                            style={{ animationDelay: `${index * 60}ms` }}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 group-hover/port:border-emerald-200 group-hover/port:bg-emerald-50 group-hover/port:scale-110 flex items-center justify-center text-gray-400 group-hover/port:text-emerald-600 text-xs font-bold transition-all duration-200">
                                {String(index + 1).padStart(2, "0")}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-gray-800 text-sm font-semibold">Port {index + 1}</span>
                                  {charger.type && (
                                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold tracking-wide ${colors.bg} ${colors.border} ${colors.text}`}>
                                      {charger.type}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                  {charger.power && (
                                    <span className="flex items-center gap-1">
                                      <FontAwesomeIcon icon={faBolt} className="text-amber-400 text-[9px]" />
                                      {charger.power} kW
                                    </span>
                                  )}
                                  {charger.totalPorts && (
                                    <span>· {charger.totalPorts} port{charger.totalPorts !== 1 ? "s" : ""}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold group-hover/port:bg-emerald-100 transition-all duration-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Available
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                          <FontAwesomeIcon icon={faPlug} className="text-gray-300 text-lg" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">No charger data available</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Reviews ── */}
                {activeTab === "reviews" && (
                  <div className="space-y-3">
                    {reviewsLoading ? (
                      <div className="flex justify-center py-10">
                        <p className="text-gray-400 text-sm animate-pulse">Loading reviews...</p>
                      </div>
                    ) : reviews.length > 0 ? (
                      reviews.map((review, index) => (
                        <div key={index}
                          className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-200 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 opacity-0 animate-[fadeInUp_0.4s_ease_forwards]"
                          style={{ animationDelay: `${index * 60}ms` }}>
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-emerald-100">
                                {review.userName?.[0]?.toUpperCase() || "U"}
                              </div>
                              <div>
                                <p className="text-gray-800 text-sm font-semibold">{review.userName || "Anonymous"}</p>
                                {review.createdAt && (
                                  <p className="text-gray-400 text-xs">
                                    {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map(s => (
                                <FontAwesomeIcon key={s} icon={faStar}
                                  className={`text-xs transition-colors duration-200 ${s <= Math.round(review.rating) ? "text-amber-400" : "text-gray-200"}`} />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-2.5 mt-0.5">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3 animate-pulse">
                          <FontAwesomeIcon icon={faStar} className="text-gray-200 text-lg" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">No reviews yet</p>
                        <p className="text-gray-400 text-xs mt-1">Be the first to review this station</p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StationDetail;
