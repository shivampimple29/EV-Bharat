import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt, faCircleCheck, faLocationDot,
  faPlug, faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function StationApproved() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMyStation();
  }, []);

  const fetchMyStation = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/stations/my-station", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStation(data.station || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-9 h-9 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center gap-5 text-center">

          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-200">
            <FontAwesomeIcon icon={faCircleCheck} className="text-white text-3xl" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">Station Approved! 🎉</h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your station is now live on EV Bharat. Drivers can find and navigate to it right now.
            </p>
          </div>

          {/* Station Info */}
          {station && (
            <div className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-left flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-100 shrink-0">
                  <FontAwesomeIcon icon={faBolt} className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{station.name}</p>
                  <p className="text-xs text-gray-400">{station.operator || "—"}</p>
                </div>
                <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                  ✓ Live
                </span>
              </div>
              <div className="flex flex-col gap-1.5 pt-1 border-t border-emerald-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FontAwesomeIcon icon={faLocationDot} className="text-emerald-400" />
                  {station.address?.city}, {station.address?.state}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FontAwesomeIcon icon={faPlug} className="text-emerald-400" />
                  {station.chargers?.length || 0} charger{station.chargers?.length !== 1 ? "s" : ""} available
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="w-full flex flex-col gap-2.5">
            <button
              onClick={() => navigate("/stations")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500
                text-white text-sm font-semibold shadow-sm shadow-emerald-200
                hover:opacity-90 active:scale-95 transition-all duration-200
                flex items-center justify-center gap-2"
            >
              View on Station Map
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600
                hover:bg-gray-50 transition-all duration-200"
            >
              Back to Home
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StationApproved;