import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faBolt, faLocationDot, faStar, faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import BookingSection from "../../Stationlist/BookingSection"; // adjust path if needed

export default function BookSlotPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [station,  setStation]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`https://ev-bharat-backend-j5s4.onrender.com/api/stations/${id}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(d  => setStation(d.station || null))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading station...</p>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !station) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
        <FontAwesomeIcon icon={faBolt} className="text-3xl text-gray-300" />
      </div>
      <p className="font-bold text-gray-600">Station not found</p>
      <p className="text-sm text-gray-400">This station may have been removed or the link is invalid.</p>
      <button
        onClick={() => navigate("/stations")}
        className="mt-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-100 active:scale-95 transition-all"
      >
        Browse Stations
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Station header ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 pt-5 pb-5 shadow-xl">
        <button
          onClick={() => navigate(`/stations/${id}`)}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors active:scale-95"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Station
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-900/30">
            <FontAwesomeIcon icon={faBolt} className="text-white text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-0.5">
              Book a Slot
            </p>
            <p className="text-white font-black text-base leading-tight truncate">
              {station.name}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <FontAwesomeIcon icon={faLocationDot} className="text-emerald-400 text-xs" />
              <span className="text-white/50 text-xs">
                {[station.address?.city, station.address?.state].filter(Boolean).join(", ")}
              </span>
              {station.averageRating > 0 && (
                <>
                  <span className="text-white/20 text-xs">·</span>
                  <FontAwesomeIcon icon={faStar} className="text-amber-400 text-xs" />
                  <span className="text-white/50 text-xs">{station.averageRating.toFixed(1)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking section ───────────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <BookingSection station={station} />
      </div>

    </div>
  );
}
