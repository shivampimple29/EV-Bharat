import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt, faArrowLeft, faCalendarDays,
  faClock, faPlug, faCircleCheck, faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const TIME_SLOTS = [
  "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM",
  "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM",
];

const CHARGER_TYPES = [
  { label: "Type 2 AC",  speed: "7 kW",  color: "emerald" },
  { label: "CCS2 DC",   speed: "50 kW", color: "blue" },
  { label: "CHAdeMO",   speed: "50 kW", color: "purple" },
  { label: "GB/T DC",   speed: "60 kW", color: "teal" },
];

function BookSlot() {
  const { stationId } = useParams();
  const navigate = useNavigate();

  const [station, setStation] = useState(null);
  const [loadingStation, setLoadingStation] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedCharger, setSelectedCharger] = useState("");
  const [duration, setDuration] = useState("1");

  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchStation();
  }, []);

  const fetchStation = async () => {
    setLoadingStation(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/stations/${stationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStation(data.station || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStation(false);
    }
  };

  const isFormValid = selectedDate && selectedSlot && selectedCharger && duration;

  const handleBook = async () => {
    if (!isFormValid) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200)); // ⚠️ replace with real API call later
    setSubmitting(false);
    setBooked(true);
  };

  const chargerColor = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", selected: "bg-emerald-500 border-emerald-500 text-white" },
    blue:    { bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-600",    selected: "bg-blue-500 border-blue-500 text-white" },
    purple:  { bg: "bg-purple-50",  border: "border-purple-200",  text: "text-purple-600",  selected: "bg-purple-500 border-purple-500 text-white" },
    teal:    { bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-600",    selected: "bg-teal-500 border-teal-500 text-white" },
  };

  // ── Success Screen ──
  if (booked) {
    return (
      <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-200">
            <FontAwesomeIcon icon={faCircleCheck} className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Slot Booked!</h2>
            <p className="text-sm text-gray-400">Your charging slot has been reserved successfully.</p>
          </div>

          {/* Booking Summary */}
          <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left flex flex-col gap-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Station</span>
              <span className="font-semibold text-gray-700">{station?.name || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Date</span>
              <span className="font-semibold text-gray-700">
                {new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Time</span>
              <span className="font-semibold text-gray-700">{selectedSlot}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Charger</span>
              <span className="font-semibold text-gray-700">{selectedCharger}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Duration</span>
              <span className="font-semibold text-gray-700">{duration} hr{duration > 1 ? "s" : ""}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/stations")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500
              text-white text-sm font-semibold shadow-sm shadow-emerald-200
              hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            Back to Stations
          </button>
        </div>
      </div>
    );
  }

  if (loadingStation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
          <p className="text-sm text-gray-400">Loading station...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
              hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-gray-500 text-sm" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-200">
              <FontAwesomeIcon icon={faBolt} className="text-white text-sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Book a Slot</h1>
              <p className="text-xs text-gray-400">{station?.name || "EV Charging Station"}</p>
            </div>
          </div>
        </div>

        {/* ── Station Info ── */}
        {station && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 mb-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-200 shrink-0">
              <FontAwesomeIcon icon={faBolt} className="text-white text-sm" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{station.name}</p>
              <p className="text-xs text-gray-500">
                {station.address?.city}, {station.address?.state}
              </p>
            </div>
          </div>
        )}

        {/* ── Date ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faCalendarDays} className="text-emerald-500 text-sm" />
            <h2 className="text-sm font-semibold text-gray-700">Select Date</h2>
          </div>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5
              outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
          />
        </div>

        {/* ── Time Slot ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faClock} className="text-emerald-500 text-sm" />
            <h2 className="text-sm font-semibold text-gray-700">Select Time Slot</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all duration-200
                  ${selectedSlot === slot
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-200"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* ── Charger Type ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faPlug} className="text-emerald-500 text-sm" />
            <h2 className="text-sm font-semibold text-gray-700">Charger Type</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {CHARGER_TYPES.map((c) => {
              const col = chargerColor[c.color];
              const isSelected = selectedCharger === c.label;
              return (
                <button
                  key={c.label}
                  onClick={() => setSelectedCharger(c.label)}
                  className={`flex flex-col items-start px-4 py-3 rounded-xl border transition-all duration-200
                    ${isSelected ? col.selected : `${col.bg} ${col.border} ${col.text}`}
                    hover:shadow-sm`}
                >
                  <p className="text-sm font-semibold">{c.label}</p>
                  <p className={`text-xs mt-0.5 ${isSelected ? "text-white/80" : "text-gray-400"}`}>{c.speed}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Duration ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faClock} className="text-emerald-500 text-sm" />
            <h2 className="text-sm font-semibold text-gray-700">Duration (hours)</h2>
          </div>
          <div className="flex gap-2">
            {["1", "2", "3", "4"].map((h) => (
              <button
                key={h}
                onClick={() => setDuration(h)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200
                  ${duration === h
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-200"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* ── Submit ── */}
        <button
          onClick={handleBook}
          disabled={!isFormValid || submitting}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500
            text-white text-sm font-semibold shadow-sm shadow-emerald-200
            hover:opacity-90 active:scale-95 transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
            flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCircleCheck} />
              Confirm Booking
            </>
          )}
        </button>

      </div>
    </div>
  );
}

export default BookSlot;