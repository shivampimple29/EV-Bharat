import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt, faLocationDot, faBuilding,
  faPlus, faTrash, faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../context/AuthContext";

const CHARGER_TYPES  = ["CCS", "CCS2", "CHAdeMO", "Type2", "AC", "DC"];
const AMENITY_OPTIONS = ["wifi", "parking", "cafe", "food", "security", "restroom"];

function AddStation() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading,   setLoading]   = useState(false);
  const [chargers,  setChargers]  = useState([{ type: "CCS2", power: 50, totalPorts: 2, availablePorts: 2 }]);
  const [amenities, setAmenities] = useState([]);

  // ── Charger helpers ──
  const addCharger = () =>
    setChargers([...chargers, { type: "CCS2", power: 50, totalPorts: 2, availablePorts: 2 }]);

  const removeCharger = (i) =>
    setChargers(chargers.filter((_, idx) => idx !== i));

  const updateCharger = (i, field, value) =>
    setChargers(chargers.map((c, idx) => idx === i ? { ...c, [field]: value } : c));

  const toggleAmenity = (a) =>
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  // ── Submit ──
  const onSubmit = async (data) => {
    if (chargers.length === 0) {
      toast.error("Add at least one charger");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name:        data.name,
          description: data.description,
          operator:    data.operator,
          city:        data.city,
          state:       data.state,
          country:     data.country || "India",
          lat:         data.lat,
          lng:         data.lng,
          chargers:    chargers.map((c) => ({
            type:           c.type,
            power:          Number(c.power),
            totalPorts:     Number(c.totalPorts),
            availablePorts: Number(c.availablePorts),
          })),
          amenities,
        }),
      });

      const result = await res.json();
      if (!res.ok) { toast.error(result.error || "Submission failed"); return; }

      toast.success("Station submitted for review! ✅");
      setTimeout(() => navigate("/stations"), 1500);

    } catch {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm
                    text-gray-800 placeholder-gray-400 outline-none
                    focus:border-emerald-400 focus:bg-white focus:ring-2
                    focus:ring-emerald-100 transition-all duration-200`;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Add <span className="text-emerald-500">Charging Station</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your station will be reviewed by admin before going live.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* ── Basic Info ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              Basic Info
            </h2>

            <input placeholder="Station Name *"
              className={inputCls} {...register("name", { required: true })} />
            {errors.name && <p className="text-xs text-red-500">Name is required</p>}

            <input placeholder="Operator / Brand (e.g. Tata Power)"
              className={inputCls} {...register("operator")} />

            <textarea placeholder="Description (optional)"
              rows={3} className={`${inputCls} resize-none`} {...register("description")} />
          </div>

          {/* ── Location ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="text-emerald-500" />
              Location
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Latitude *" type="number" step="any"
                className={inputCls} {...register("lat", { required: true })} />
              <input placeholder="Longitude *" type="number" step="any"
                className={inputCls} {...register("lng", { required: true })} />
            </div>
            {(errors.lat || errors.lng) && (
              <p className="text-xs text-red-500">Latitude and longitude are required</p>
            )}
            <p className="text-xs text-gray-400">
              💡 Open Google Maps → right-click your location → copy coordinates
            </p>

            <div className="grid grid-cols-3 gap-3">
              <input placeholder="City" className={inputCls} {...register("city")} />
              <input placeholder="State" className={inputCls} {...register("state")} />
              <input placeholder="Country" defaultValue="India"
                className={inputCls} {...register("country")} />
            </div>
          </div>

          {/* ── Chargers ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <FontAwesomeIcon icon={faBolt} className="text-emerald-500" />
                Chargers
              </h2>
              <button type="button" onClick={addCharger}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600
                           bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100
                           transition-colors">
                <FontAwesomeIcon icon={faPlus} />
                Add Charger
              </button>
            </div>

            {chargers.map((c, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl relative">
                {/* Remove button */}
                {chargers.length > 1 && (
                  <button type="button" onClick={() => removeCharger(i)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600
                               transition-colors text-xs">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}

                {/* Type */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Type</label>
                  <select value={c.type} onChange={(e) => updateCharger(i, "type", e.target.value)}
                    className={inputCls}>
                    {CHARGER_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Power */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Power (kW)</label>
                  <input type="number" value={c.power}
                    onChange={(e) => updateCharger(i, "power", e.target.value)}
                    className={inputCls} />
                </div>

                {/* Total Ports */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Total Ports</label>
                  <input type="number" value={c.totalPorts}
                    onChange={(e) => updateCharger(i, "totalPorts", e.target.value)}
                    className={inputCls} />
                </div>

                {/* Available Ports */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Available Ports</label>
                  <input type="number" value={c.availablePorts}
                    onChange={(e) => updateCharger(i, "availablePorts", e.target.value)}
                    className={inputCls} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Amenities ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="text-emerald-500" />
              Amenities
            </h2>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
                    ${amenities.includes(a)
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300"
                    }`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* ── Submit ── */}
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                       bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold
                       shadow-md shadow-emerald-200 hover:shadow-lg hover:scale-[1.01]
                       active:scale-95 transition-all duration-200 disabled:opacity-60">
            {loading ? "Submitting..." : (
              <>Submit Station <FontAwesomeIcon icon={faArrowRight} /></>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddStation;