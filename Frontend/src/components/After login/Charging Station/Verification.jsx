import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt, faClock, faArrowLeft,
  faCircleCheck, faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

function Verification() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMyStation();

    // Poll every 10 seconds
  const interval = setInterval(fetchMyStation, 10000);

  // Cleanup on unmount
  return () => clearInterval(interval);
  }, []);

  const fetchMyStation = async () => {
    try {
      const res = await fetch("https://ev-bharat-backend-j5s4.onrender.com/api/stations/my-station", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const s = data.station || null;
      setStation(s);

      // Auto-redirect based on actual status
      if (s?.status === "approved" || s?.isVerified) navigate("/station-approved");
      else if (s?.status === "rejected") navigate("/station-rejected");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
          <p className="text-sm text-gray-400">Checking status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center gap-5 text-center">

          {/* Animated Icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md shadow-amber-200">
              <FontAwesomeIcon icon={faClock} className="text-white text-3xl" />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 animate-ping opacity-60" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">Under Review</h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your station has been submitted and is currently being reviewed by our team. This usually takes 24–48 hours.
            </p>
          </div>

          {/* Station Info */}
          {station && (
            <div className="w-full bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-100 shrink-0">
                <FontAwesomeIcon icon={faBolt} className="text-white text-sm" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{station.name}</p>
                <p className="text-xs text-gray-400">{station.address?.city}, {station.address?.state}</p>
              </div>
              <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-600 border border-amber-200">
                Pending
              </span>
            </div>
          )}

          {/* Steps */}
          <div className="w-full flex flex-col gap-2.5">
            {[
              { label: "Station submitted",       done: true  },
              { label: "Admin review in progress", done: false },
              { label: "Approval & go live",       done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={step.done ? faCircleCheck : faClock}
                  className={`text-sm ${step.done ? "text-emerald-500" : "text-gray-300"}`}
                />
                <p className={`text-sm ${step.done ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>

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
  );
}

export default Verification;