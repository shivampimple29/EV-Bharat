import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt, faLayerGroup, faRoute,
  faSpinner, faClock, faRoad,
  faLocationCrosshairs, faXmark,
} from "@fortawesome/free-solid-svg-icons";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MAP_STYLES = [
  { key: "streets",   label: "Streets",   url: "mapbox://styles/mapbox/streets-v11" },
  { key: "satellite", label: "Satellite", url: "mapbox://styles/mapbox/satellite-streets-v12" },
  { key: "light",     label: "Light",     url: "mapbox://styles/mapbox/light-v11" },
];

// 50 km radius for nearby stations
const NEARBY_RADIUS_METERS = 50000;
const NEARBY_LIMIT          = 200;

// ─── Marker element creators ───────────────────────────────────────────────────
const mkUserDot = () => {
  const el = document.createElement("div");
  el.style.cssText = "width:20px;height:20px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 5px rgba(59,130,246,0.25);";
  return el;
};
const mkStationDot = () => {
  const el = document.createElement("div");
  el.style.cssText = "width:30px;height:30px;background:#10b981;border:2.5px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer;";
  el.textContent = "⚡";
  return el;
};
const mkDestPin = () => {
  const el = document.createElement("div");
  el.style.cssText = "width:28px;height:28px;background:#ef4444;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);";
  return el;
};

// ──────────────────────────────────────────────────────────────────────────────
function MapView({ destinationStation = null }) {
  const navigate     = useNavigate();
  const mapContainer = useRef(null);
  const mapRef       = useRef(null);
  const [mapLoaded,    setMapLoaded]    = useState(false);
  const [stationCount, setStationCount] = useState(0);
  const [activeStyle,  setActiveStyle]  = useState("streets");
  const [showPicker,   setShowPicker]   = useState(false);

  // GPS state
  const [userLocation, setUserLocation] = useState(null);
  const [gpsLoading,   setGpsLoading]   = useState(false);
  const [gpsError,     setGpsError]     = useState(null);

  // Navigation state
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeInfo,    setRouteInfo]    = useState(null);
  const [navActive,    setNavActive]    = useState(false);

  // Refs to control markers
  const userMarkerRef       = useRef(null);
  const destMarkerRef       = useRef(null);
  const stationMarkersRef   = useRef([]);   // all ⚡ markers

  // ── Hide / show all station markers (for nav mode toggle) ─────────────────
  const hideStationMarkers = () =>
    stationMarkersRef.current.forEach(m => m.getElement().style.display = "none");
  const showStationMarkers = () =>
    stationMarkersRef.current.forEach(m => m.getElement().style.display = "");

  // ── Get GPS ───────────────────────────────────────────────────────────────
  const getGPS = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error("GPS not supported.")); return; }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()  => reject(new Error("Location access denied. Please allow GPS.")),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  // ── Place user's blue dot ─────────────────────────────────────────────────
  const placeUserMarker = useCallback((loc) => {
    if (userMarkerRef.current) userMarkerRef.current.remove();
    userMarkerRef.current = new mapboxgl.Marker({ element: mkUserDot() })
      .setLngLat([loc.lng, loc.lat])
      .setPopup(new mapboxgl.Popup({ offset: 12 }).setText("📍 You are here"))
      .addTo(mapRef.current);
  }, []);

  // ── Draw route using Mapbox Directions API ────────────────────────────────
  const drawRoute = useCallback(async (origin, dest) => {
    const map = mapRef.current;
    setRouteLoading(true);
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const data = await (await fetch(url)).json();
      if (!data.routes?.length) { setGpsError("No route found to this station."); return; }
      const route = data.routes[0];
      setRouteInfo({ distance: (route.distance / 1000).toFixed(1), duration: Math.round(route.duration / 60) });

      // Remove old layers/source
      if (map.getLayer("nav-route"))   map.removeLayer("nav-route");
      if (map.getLayer("nav-casing"))  map.removeLayer("nav-casing");
      if (map.getSource("nav-route"))  map.removeSource("nav-route");

      map.addSource("nav-route", { type: "geojson", data: { type: "Feature", geometry: route.geometry } });
      map.addLayer({ id: "nav-casing", type: "line", source: "nav-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint:  { "line-color": "#ffffff", "line-width": 10 } });
      map.addLayer({ id: "nav-route", type: "line", source: "nav-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint:  { "line-color": "#3b82f6", "line-width": 6 } });
    } catch {
      setGpsError("Route calculation failed.");
    } finally {
      setRouteLoading(false);
    }
  }, []);

  // ── Clear route, restore station markers ──────────────────────────────────
  const clearNavigation = useCallback(() => {
    const map = mapRef.current;
    if (map.getLayer("nav-route"))   map.removeLayer("nav-route");
    if (map.getLayer("nav-casing"))  map.removeLayer("nav-casing");
    if (map.getSource("nav-route"))  map.removeSource("nav-route");
    if (destMarkerRef.current) { destMarkerRef.current.remove(); destMarkerRef.current = null; }
    showStationMarkers();          // ← bring back ⚡ markers
    setRouteInfo(null);
    setNavActive(false);
    setGpsError(null);
  }, []);

  // ── START NAVIGATION — GPS → hide markers → place pins → draw route ───────
  const startNavigation = useCallback(async () => {
    if (!destinationStation) return;
    setGpsLoading(true);
    setGpsError(null);
    try {
      const loc = await getGPS();
      setUserLocation(loc);
      setNavActive(true);

      const map = mapRef.current;
      hideStationMarkers();          // ← hide all ⚡ markers

      // Place user dot
      placeUserMarker(loc);

      // Place destination red pin
      const [dLng, dLat] = destinationStation.location.coordinates;
      if (destMarkerRef.current) destMarkerRef.current.remove();
      destMarkerRef.current = new mapboxgl.Marker({ element: mkDestPin() })
        .setLngLat([dLng, dLat])
        .setPopup(new mapboxgl.Popup({ offset: 12 }).setHTML(`<strong>${destinationStation.name}</strong><br/><small style="color:#6b7280">Destination ⚡</small>`))
        .addTo(map);

      // Fit map to show both points
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([loc.lng, loc.lat]);
      bounds.extend([dLng, dLat]);
      map.fitBounds(bounds, { padding: { top: 80, bottom: 220, left: 60, right: 60 }, duration: 1200 });

      await drawRoute(loc, { lng: dLng, lat: dLat });
    } catch (err) {
      setGpsError(err.message);
    } finally {
      setGpsLoading(false);
    }
  }, [destinationStation, placeUserMarker, drawRoute]);

  // ── When destinationStation appears: pre-drop the destination pin ─────────
  useEffect(() => {
    if (!destinationStation || !mapLoaded) return;
    const [dLng, dLat] = destinationStation.location.coordinates;
    const map = mapRef.current;
    if (destMarkerRef.current) destMarkerRef.current.remove();
    destMarkerRef.current = new mapboxgl.Marker({ element: mkDestPin() })
      .setLngLat([dLng, dLat])
      .setPopup(new mapboxgl.Popup({ offset: 12 }).setHTML(`<strong>${destinationStation.name}</strong>`))
      .addTo(map);
    map.flyTo({ center: [dLng, dLat], zoom: 13, duration: 1000 });
  }, [destinationStation, mapLoaded]);

  // ── INIT MAP ──────────────────────────────────────────────────────────────
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [72.8777, 19.076],    // Mumbai fallback
      zoom: 6,
    });
    const map = mapRef.current;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // ── Try GPS on mount ──────────────────────────────────────────────────
    let userLoc = null;
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(userLoc);
        map.flyTo({ center: [userLoc.lng, userLoc.lat], zoom: 12 });
        placeUserMarker(userLoc);
      },
      () => { /* GPS denied — stay on Mumbai */ }
    );

    map.on("load", async () => {
      setMapLoaded(true);
      try {
        // ── Use /nearby if GPS available, else /map (all stations) ───────
        let stations = [];
        if (userLoc) {
          // Fetch pages until we have NEARBY_LIMIT stations
          let page = 1, fetched = 0;
          while (fetched < NEARBY_LIMIT) {
            const res = await fetch(
              `http://localhost:8000/api/stations/nearby?lat=${userLoc.lat}&lng=${userLoc.lng}&radius=${NEARBY_RADIUS_METERS}&page=${page}`
            );
            const data = await res.json();
            const batch = data.stations || [];
            stations = [...stations, ...batch];
            fetched += batch.length;
            if (batch.length < 20 || fetched >= data.total) break;
            page++;
          }
          stations = stations.slice(0, NEARBY_LIMIT);
        } else {
          // No GPS — show all stations from /map (original behaviour)
          const res = await fetch("http://localhost:8000/api/stations/map");
          const data = await res.json();
          stations = data.stations || [];
        }

        setStationCount(stations.length);

        stations.forEach((station) => {
          const [sLng, sLat] = station.location.coordinates;
          const popup = new mapboxgl.Popup({ offset: 25, maxWidth: "240px" }).setHTML(`
            <div style="font-family:sans-serif;padding:4px 2px">
              <p style="font-weight:700;font-size:13px;margin:0 0 2px;
              background:linear-gradient(to right,#34d399,#0d9488);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;">
              ${station.name}</p>
              <p style="color:#6b7280;font-size:11px;margin:0 0 8px">${station.operator || "Unknown Operator"}</p>
              <button
                onclick="window.location.href='/stations/${station._id}'"
                style="width:100%;background:linear-gradient(to top,#34d399,#0d9488);color:white;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">
                View Details →
              </button>
            </div>
          `);
          const marker = new mapboxgl.Marker({ element: mkStationDot() })
            .setLngLat([sLng, sLat])
            .setPopup(popup)
            .addTo(map);
          stationMarkersRef.current.push(marker);  // track for hide/show
        });
      } catch (err) {
        console.error("Stations load failed:", err);
      }
    });

    return () => map.remove();
  }, [placeUserMarker]);

  // ── Style switcher ────────────────────────────────────────────────────────
  const handleStyleChange = (styleObj) => {
    const map = mapRef.current;
    map.setStyle(styleObj.url);
    setActiveStyle(styleObj.key);
    setShowPicker(false);
    map.once("style.load", () => {
      if (navActive && userLocation && destinationStation) {
        const [dLng, dLat] = destinationStation.location.coordinates;
        drawRoute(userLocation, { lng: dLng, lat: dLat });
      }
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
          <div className="text-center">
            <FontAwesomeIcon icon={faBolt} className="text-green-500 text-4xl animate-pulse mb-3" />
            <p className="text-gray-600 font-medium">Loading Map...</p>
          </div>
        </div>
      )}

      {/* GPS error banner */}
      {gpsError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-red-500 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-3 text-sm max-w-xs w-[90%]">
          <span className="flex-1">{gpsError}</span>
          <button onClick={() => setGpsError(null)}><FontAwesomeIcon icon={faXmark} /></button>
        </div>
      )}

      {/* Style picker */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="bg-white shadow-md rounded-lg px-3 py-2 text-sm font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition"
        >
          <FontAwesomeIcon icon={faLayerGroup} className="text-gray-500" /> Style
        </button>
        {showPicker && (
          <div className="mt-2 bg-white rounded-xl shadow-xl overflow-hidden w-36 border border-gray-100">
            {MAP_STYLES.map(s => (
              <button key={s.key} onClick={() => handleStyleChange(s)}
                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition ${activeStyle === s.key ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"}`}>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Station count badge (normal mode only) */}
      {mapLoaded && stationCount > 0 && !destinationStation && (
        <div className="absolute bottom-6 right-4 z-20 bg-white shadow-md rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 flex items-center gap-1.5">
          <FontAwesomeIcon icon={faBolt} className="text-green-500" />
          {stationCount} nearby stations
        </div>
      )}

      {/* ── NAVIGATION PANEL (nav mode only) ── */}
      {destinationStation && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-sm">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

            {/* Destination header */}
            <div className="bg-gradient-to-t from-emerald-400 to-teal-600 px-4 py-3 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80 mb-0.5">Destination</p>
              <p className="font-bold text-sm leading-tight truncate">{destinationStation.name}</p>
              <p className="text-xs opacity-70 mt-0.5">{destinationStation.address?.city}, {destinationStation.address?.state}</p>
            </div>

            {/* Route stats */}
            {routeLoading && (
              <div className="flex items-center justify-center gap-2 py-4 text-gray-500 text-sm">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-blue-500" />
                Calculating route...
              </div>
            )}
            {routeInfo && !routeLoading && (
              <div className="grid grid-cols-2 divide-x divide-gray-100 py-3">
                <div className="flex flex-col items-center gap-1 px-4">
                  <FontAwesomeIcon icon={faRoad} className="text-blue-500 text-base" />
                  <span className="text-2xl font-bold text-gray-800">{routeInfo.distance}</span>
                  <span className="text-xs text-gray-400 -mt-1">km</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-4">
                  <FontAwesomeIcon icon={faClock} className="text-orange-400 text-base" />
                  <span className="text-2xl font-bold text-gray-800">{routeInfo.duration}</span>
                  <span className="text-xs text-gray-400 -mt-1">min drive</span>
                </div>
              </div>
            )}

            {/* GPS confirmed badge */}
            {userLocation && (
              <div className="mx-4 m-2 bg-blue-50 rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-blue-700">
                <FontAwesomeIcon icon={faLocationCrosshairs} />
                <span className="font-medium">Your GPS location detected</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 px-4 pb-4">
              {!navActive && !gpsLoading && (
                <button onClick={startNavigation}
                  className="flex-1 bg-gradient-to-t from-emerald-400 to-teal-600 active:scale-95 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all">
                  <FontAwesomeIcon icon={faRoute} /> Get Directions
                </button>
              )}
              {gpsLoading && (
                <button disabled className="flex-1 bg-emerald-300 text-white py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Getting GPS...
                </button>
              )}
              {navActive && !gpsLoading && (
                <>
                  <button onClick={startNavigation}
                    className="flex-1 bg-gradient-to-t from-emerald-400 to-teal-600 active:scale-95 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all">
                    <FontAwesomeIcon icon={faRoute} /> Recalculate
                  </button>
                  <button onClick={clearNavigation}
                    className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm transition-all">
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;
