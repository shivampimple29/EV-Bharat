import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // ← added
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot, faCircleInfo, faBolt, faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MAP_STYLES = [
  { key: "streets",   label: "Streets",   url: "mapbox://styles/mapbox/streets-v11"           },
  { key: "satellite", label: "Satellite", url: "mapbox://styles/mapbox/satellite-streets-v12" },
  { key: "light",     label: "Light",     url: "mapbox://styles/mapbox/light-v11"              },
];

function MapView() {
  const navigate     = useNavigate(); // ← added
  const mapContainer = useRef(null);
  const mapRef       = useRef(null);
  const [mapLoaded,    setMapLoaded]    = useState(false);
  const [stationCount, setStationCount] = useState(0);
  const [activeStyle,  setActiveStyle]  = useState("streets");
  const [showPicker,   setShowPicker]   = useState(false);

  useEffect(() => {
    const lat = 19.076;
    const lng = 72.8777;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 6,
    });

    const map = mapRef.current;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // User location marker
    new mapboxgl.Marker({ color: "#3b82f6" })
      .setLngLat([lng, lat])
      .addTo(map);

    map.on("load", async () => {
      setMapLoaded(true);
      try {
        const response = await fetch(
  `http://localhost:8000/api/stations/map`
);
        const result   = await response.json();
        const stations = result.stations;
        setStationCount(stations.length);

        stations.forEach((station) => {
          const coordinates = station.location.coordinates;

          const popup = new mapboxgl.Popup({
            offset: 25,
            className: "ev-popup",
            maxWidth: "240px",
          }).setHTML(`
            <div style="
              font-family:'Poppins',sans-serif;
              background:#ffffff;
              border:1px solid #d1fae5;
              border-radius:16px;
              padding:16px;
              box-shadow:0 16px 40px rgba(0,0,0,0.10);
            ">
              <div style="
                display:inline-flex;align-items:center;gap:6px;
                background:#ecfdf5;border:1px solid #a7f3d0;
                border-radius:999px;padding:3px 10px;
                font-size:9px;font-weight:800;color:#059669;
                letter-spacing:0.1em;text-transform:uppercase;
                margin-bottom:10px;
              ">
                <span style="width:6px;height:6px;border-radius:50%;
                             background:#10b981;display:inline-block;"></span>
                EV Bharat Station
              </div>

              <h3 style="font-weight:800;font-size:14px;color:#111827;
                         margin:0 0 2px 0;line-height:1.35;">
                ${station.name}
              </h3>

              <p style="font-size:11px;color:#9ca3af;margin:0 0 12px 0;">
                ${station.operator || "Unknown Operator"}
              </p>

              <div style="height:1px;background:#f3f4f6;margin-bottom:12px;"></div>

              <button
                onclick="window.__navigateTo('/stations/${station._id}')"
                style="
                  display:inline-flex;align-items:center;gap:5px;
                  background:linear-gradient(135deg,#10b981,#0d9488);
                  color:white;font-size:11px;font-weight:700;
                  padding:6px 14px;border-radius:9px;
                  border:none;cursor:pointer;
                  box-shadow:0 4px 12px rgba(16,185,129,0.25);
                "
              >
                View Details →
              </button>
            </div>
          `);

          new mapboxgl.Marker({ color: "#10b981" })
            .setLngLat([coordinates[0], coordinates[1]])
            .setPopup(popup)
            .addTo(map);
        });

      } catch (err) {
        console.error(err);
      }
    });

    // ← Expose navigate to popup's inline onclick — bridges Mapbox HTML to React Router
    window.__navigateTo = (path) => navigate(path);

    return () => {
      map.remove();
      delete window.__navigateTo; // ← cleanup on unmount
    };
  }, []);

  const switchStyle = (key) => {
    const s = MAP_STYLES.find(s => s.key === key);
    if (s && mapRef.current) {
      mapRef.current.setStyle(s.url);
      setActiveStyle(key);
      setShowPicker(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200
                    shadow-sm overflow-hidden
                    hover:shadow-xl hover:shadow-emerald-50/80
                    hover:border-emerald-100
                    transition-all duration-500 ease-in-out">

      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500
                      scale-x-0 group-hover:scale-x-100 origin-left
                      transition-transform duration-500 ease-out" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">

        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-emerald-300/20 blur-sm
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-300" />
            <div className="relative w-9 h-9 rounded-xl
                            bg-emerald-50 border border-emerald-100
                            flex items-center justify-center
                            group-hover:bg-emerald-100 group-hover:border-emerald-200
                            group-hover:scale-110 transition-all duration-300">
              <FontAwesomeIcon icon={faLocationDot}
                className="text-emerald-500 text-sm
                           group-hover:text-emerald-600 transition-colors duration-300" />
            </div>
          </div>
          <div>
            <p className="text-gray-800 text-sm font-bold leading-tight">Live Station Map</p>
            <p className="text-gray-400 text-xs">Mumbai & surrounding region</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">

          {/* Station count */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5
                          rounded-full bg-emerald-50 border border-emerald-100
                          text-emerald-600 text-xs font-semibold
                          transition-all duration-500
                          ${mapLoaded
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-1 pointer-events-none"
                          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {stationCount} stations
          </div>

          {/* Style picker */}
          <div className="relative">
            <button onClick={() => setShowPicker(!showPicker)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border
                          text-xs font-semibold hover:scale-105 active:scale-95
                          transition-all duration-200
                          ${showPicker
                            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}>
              <FontAwesomeIcon icon={faLayerGroup} className="text-[10px]" />
              <span className="hidden sm:inline capitalize">{activeStyle}</span>
            </button>

            {showPicker && (
              <div className="absolute right-0 top-full mt-1.5 z-30
                              bg-white rounded-xl border border-gray-200
                              shadow-xl overflow-hidden w-32
                              animate-[fadeInUp_0.15s_ease_forwards]">
                {MAP_STYLES.map((s) => (
                  <button key={s.key} onClick={() => switchStyle(s.key)}
                    className={`flex items-center gap-2 w-full px-4 py-2.5
                                text-xs font-semibold text-left
                                hover:bg-emerald-50 hover:text-emerald-600
                                transition-colors duration-150
                                ${activeStyle === s.key
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "text-gray-600"
                                }`}>
                    {activeStyle === s.key && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    )}
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400
                          pl-2.5 border-l border-gray-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 ring-2 ring-blue-100" />
              You
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-100" />
              Station
            </span>
          </div>

        </div>
      </div>

      {/* ── Map area ── */}
      <div className="relative overflow-hidden"> {/* ← overflow-hidden clips markers */}

        {/* Loading overlay */}
        {!mapLoaded && (
          <div className="absolute inset-0 z-10
                          flex flex-col items-center justify-center
                          bg-gradient-to-br from-gray-50 to-emerald-50/30
                          transition-opacity duration-500">
            <div className="relative w-14 h-14 mb-4">
              <div className="absolute inset-0 rounded-full border-2
                              border-emerald-300 animate-ping opacity-25" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent
                              border-t-emerald-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent
                              border-t-teal-400 animate-spin [animation-duration:0.6s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FontAwesomeIcon icon={faLocationDot}
                  className="text-emerald-400 text-xs" />
              </div>
            </div>
            <p className="text-emerald-600 text-xs font-bold
                          tracking-[0.2em] uppercase animate-pulse">
              Rendering Map...
            </p>
            <p className="text-gray-400 text-xs mt-1.5">
              Loading {stationCount > 0 ? stationCount : "..."} stations
            </p>
          </div>
        )}

        {/* Map container */}
        <div
          ref={mapContainer}
          className={`w-full h-[460px]
                      transition-opacity duration-700 ease-in-out
                      ${mapLoaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-10
                        bg-gradient-to-t from-white/50 to-transparent
                        pointer-events-none" />
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between
                      px-5 py-3.5 border-t border-gray-100 bg-gray-50/40">
        <p className="text-gray-400 text-xs flex items-center gap-1.5">
          <FontAwesomeIcon icon={faBolt} className="text-emerald-400 text-[10px]" />
          Click any marker to view station details
        </p>
        <p className="text-gray-300 text-xs flex items-center gap-1">
          <FontAwesomeIcon icon={faCircleInfo} className="text-[10px]" />
          Mapbox
        </p>
      </div>

    </div>
  );
}

export default MapView;
