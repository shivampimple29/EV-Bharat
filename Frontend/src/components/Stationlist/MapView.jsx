import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt, faLayerGroup, faRoute,
  faSpinner, faClock, faRoad,
  faLocationCrosshairs, faXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MAP_STYLES = [
  { key: "streets",   label: "Streets",   url: "mapbox://styles/mapbox/streets-v11" },
  { key: "satellite", label: "Satellite", url: "mapbox://styles/mapbox/satellite-streets-v12" },
  { key: "light",     label: "Light",     url: "mapbox://styles/mapbox/light-v11" },
];

// ─── Marker creators ──────────────────────────────────────────────────────────
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
const mkSourcePin = () => {
  const el = document.createElement("div");
  el.style.cssText = "width:28px;height:28px;background:#10b981;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);";
  return el;
};
const mkRouteStationDot = () => {
  const el = document.createElement("div");
  el.style.cssText = "width:32px;height:32px;background:#8b5cf6;border:2.5px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(139,92,246,0.4);cursor:pointer;";
  el.textContent = "⚡";
  return el;
};

// ── geocode outside component — no stale closure ──────────────────────────────
const geocode = async (query) => {
  const url  = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=IN&access_token=${mapboxgl.accessToken}`;
  const res  = await fetch(url);
  const data = await res.json();
  if (!data.features?.length) throw new Error(`Could not find "${query}". Try a more specific name.`);
  const [lng, lat] = data.features[0].center;
  return { lat, lng, name: data.features[0].place_name };
};

// ─────────────────────────────────────────────────────────────────────────────
function MapView({ destinationStation = null, mapHeight = "h-64" }) {
  const mapContainer = useRef(null);
  const mapRef       = useRef(null);
  const [mapLoaded,    setMapLoaded]    = useState(false);
  const [stationCount, setStationCount] = useState(0);
  const [activeStyle,  setActiveStyle]  = useState("streets");
  const [showPicker,   setShowPicker]   = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [gpsLoading,   setGpsLoading]   = useState(false);
  const [gpsError,     setGpsError]     = useState(null);

  const [routeLoading, setRouteLoading] = useState(false);
  const [routeInfo,    setRouteInfo]    = useState(null);
  const [navActive,    setNavActive]    = useState(false);

  const [routePlannerMode, setRoutePlannerMode] = useState(false);
  const [sourceInput,      setSourceInput]      = useState("");
  const [destInput,        setDestInput]        = useState("");
  const [plannerLoading,   setPlannerLoading]   = useState(false);
  const [plannerError,     setPlannerError]     = useState(null);
  const [routePlannerInfo, setRoutePlannerInfo] = useState(null);

  const userMarkerRef          = useRef(null);
  const destMarkerRef          = useRef(null);
  const stationMarkersRef      = useRef([]);
  const routeStationMarkersRef = useRef([]);
  const sourcePinRef           = useRef(null);
  const tripDestPinRef         = useRef(null);

  const hideStationMarkers = useCallback(() => {
    stationMarkersRef.current.forEach(m => m.getElement().style.display = "none");
  }, []);
  const showStationMarkers = useCallback(() => {
    stationMarkersRef.current.forEach(m => m.getElement().style.display = "");
  }, []);
  const clearRouteStationMarkers = useCallback(() => {
    routeStationMarkersRef.current.forEach(m => m.remove());
    routeStationMarkersRef.current = [];
  }, []);

  // ── clearTripRoute — removes all 4 trip layers ────────────────────────────
  const clearTripRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    ["trip-dash", "trip-route", "trip-casing", "trip-glow"].forEach(id => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource("trip-route")) map.removeSource("trip-route");
  }, []);

  const getGPS = useCallback(() => new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error("GPS not supported.")); return; }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => reject(new Error("Location access denied. Please allow GPS.")),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }), []);

  const placeUserMarker = useCallback((loc) => {
    if (userMarkerRef.current) userMarkerRef.current.remove();
    userMarkerRef.current = new mapboxgl.Marker({ element: mkUserDot() })
      .setLngLat([loc.lng, loc.lat])
      .setPopup(new mapboxgl.Popup({ offset: 12 }).setText("📍 You are here"))
      .addTo(mapRef.current);
  }, []);

  // ── drawRoute — 4-layer premium blue nav line ─────────────────────────────
  const drawRoute = useCallback(async (origin, dest) => {
    const map = mapRef.current;
    setRouteLoading(true);
    try {
      const url  = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const data = await (await fetch(url)).json();
      if (!data.routes?.length) { setGpsError("No route found to this station."); return; }
      const route = data.routes[0];
      setRouteInfo({ distance: (route.distance / 1000).toFixed(1), duration: Math.round(route.duration / 60) });

      ["nav-dash","nav-route","nav-casing","nav-glow"].forEach(id => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
      if (map.getSource("nav-route")) map.removeSource("nav-route");

      map.addSource("nav-route", { type: "geojson", data: { type: "Feature", geometry: route.geometry } });
      // Layer 1 — outer glow
      map.addLayer({ id: "nav-glow", type: "line", source: "nav-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#3b82f6", "line-width": 20, "line-blur": 12, "line-opacity": 0.25 } });
      // Layer 2 — dark casing
      map.addLayer({ id: "nav-casing", type: "line", source: "nav-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#1d4ed8", "line-width": 11, "line-opacity": 0.9 } });
      // Layer 3 — bright fill
      map.addLayer({ id: "nav-route", type: "line", source: "nav-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#60a5fa", "line-width": 7 } });
      // Layer 4 — white dot dash
      map.addLayer({ id: "nav-dash", type: "line", source: "nav-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ffffff", "line-width": 2, "line-dasharray": [0, 3, 3], "line-opacity": 0.55 } });
    } catch (err) {
      console.error("drawRoute error:", err);
      setGpsError("Route calculation failed.");
    } finally {
      setRouteLoading(false);
    }
  }, []);

  // ── clearNavigation — removes all 4 nav layers ────────────────────────────
  const clearNavigation = useCallback(() => {
    const map = mapRef.current;
    ["nav-dash","nav-route","nav-casing","nav-glow"].forEach(id => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource("nav-route")) map.removeSource("nav-route");
    if (destMarkerRef.current) { destMarkerRef.current.remove(); destMarkerRef.current = null; }
    showStationMarkers();
    setRouteInfo(null);
    setNavActive(false);
    setGpsError(null);
  }, [showStationMarkers]);

  const clearRoutePlanner = useCallback(() => {
    clearTripRoute();
    clearRouteStationMarkers();
    if (sourcePinRef.current)   { sourcePinRef.current.remove();   sourcePinRef.current   = null; }
    if (tripDestPinRef.current) { tripDestPinRef.current.remove(); tripDestPinRef.current = null; }
    showStationMarkers();
    setRoutePlannerMode(false);
    setSourceInput("");
    setDestInput("");
    setPlannerError(null);
    setRoutePlannerInfo(null);
  }, [clearTripRoute, clearRouteStationMarkers, showStationMarkers]);

  const useGPSForSource = useCallback(async () => {
    setPlannerLoading(true);
    setPlannerError(null);
    try {
      const loc  = await getGPS();
      setUserLocation(loc);
      placeUserMarker(loc);
      const url  = `https://api.mapbox.com/geocoding/v5/mapbox.places/${loc.lng},${loc.lat}.json?access_token=${mapboxgl.accessToken}`;
      const res  = await fetch(url);
      const data = await res.json();
      const name = data.features?.[0]?.place_name || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`;
      setSourceInput(name);
    } catch (err) {
      setPlannerError(err.message);
    } finally {
      setPlannerLoading(false);
    }
  }, [getGPS, placeUserMarker]);

  // ── searchAlongRoute ──────────────────────────────────────────────────────
  const searchAlongRoute = useCallback(async () => {
    if (!sourceInput.trim() || !destInput.trim()) {
      setPlannerError("Please enter both source and destination.");
      return;
    }
    setPlannerLoading(true);
    setPlannerError(null);
    setRoutePlannerInfo(null);
    const map = mapRef.current;

    try {
      const [src, dst] = await Promise.all([
        geocode(sourceInput.trim()),
        geocode(destInput.trim()),
      ]);

      const dirUrl  = `https://api.mapbox.com/directions/v5/mapbox/driving/${src.lng},${src.lat};${dst.lng},${dst.lat}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
      const dirData = await (await fetch(dirUrl)).json();
      if (!dirData.routes?.length) throw new Error("No route found between these locations.");
      const route       = dirData.routes[0];
      const coordinates = route.geometry.coordinates;

      // ── Draw 4-layer premium purple trip route ──────────────────────────
      clearTripRoute();
      map.addSource("trip-route", { type: "geojson", data: { type: "Feature", geometry: route.geometry } });
      // Layer 1 — outer glow
      map.addLayer({ id: "trip-glow", type: "line", source: "trip-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#8b5cf6", "line-width": 20, "line-blur": 12, "line-opacity": 0.25 } });
      // Layer 2 — dark casing
      map.addLayer({ id: "trip-casing", type: "line", source: "trip-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#6d28d9", "line-width": 11, "line-opacity": 0.9 } });
      // Layer 3 — bright fill
      map.addLayer({ id: "trip-route", type: "line", source: "trip-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#a78bfa", "line-width": 7 } });
      // Layer 4 — white dot dash
      map.addLayer({ id: "trip-dash", type: "line", source: "trip-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ffffff", "line-width": 2, "line-dasharray": [0, 3, 3], "line-opacity": 0.55 } });

      // ── Premium source + destination popups ─────────────────────────────
      if (sourcePinRef.current)   sourcePinRef.current.remove();
      if (tripDestPinRef.current) tripDestPinRef.current.remove();

      sourcePinRef.current = new mapboxgl.Marker({ element: mkSourcePin() })
        .setLngLat([src.lng, src.lat])
        .setPopup(new mapboxgl.Popup({ offset: 16, maxWidth: "260px" }).setHTML(`
          <div style="font-family:'Inter',sans-serif;padding:10px 4px 4px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <div style="width:32px;height:32px;background:linear-gradient(135deg,#10b981,#0d9488);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">📍</div>
              <div>
                <p style="font-size:10px;font-weight:600;color:#10b981;text-transform:uppercase;letter-spacing:0.08em;margin:0">Starting Point</p>
                <p style="font-size:12px;font-weight:700;color:#111827;margin:2px 0 0;line-height:1.3">${src.name.split(",")[0]}</p>
              </div>
            </div>
            <p style="font-size:10px;color:#9ca3af;margin:0;padding-top:6px;border-top:1px solid #f3f4f6">${src.name}</p>
          </div>
        `))
        .addTo(map);

      tripDestPinRef.current = new mapboxgl.Marker({ element: mkDestPin() })
        .setLngLat([dst.lng, dst.lat])
        .setPopup(new mapboxgl.Popup({ offset: 16, maxWidth: "260px" }).setHTML(`
          <div style="font-family:'Inter',sans-serif;padding:10px 4px 4px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <div style="width:32px;height:32px;background:linear-gradient(135deg,#ef4444,#dc2626);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">🏁</div>
              <div>
                <p style="font-size:10px;font-weight:600;color:#ef4444;text-transform:uppercase;letter-spacing:0.08em;margin:0">Destination</p>
                <p style="font-size:12px;font-weight:700;color:#111827;margin:2px 0 0;line-height:1.3">${dst.name.split(",")[0]}</p>
              </div>
            </div>
            <p style="font-size:10px;color:#9ca3af;margin:0;padding-top:6px;border-top:1px solid #f3f4f6">${dst.name}</p>
          </div>
        `))
        .addTo(map);

      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]));
      map.fitBounds(bounds, { padding: { top: 80, bottom: 80, left: 60, right: 60 }, duration: 1200 });

      hideStationMarkers();
      clearRouteStationMarkers();

      // ── Sample coords before POST — prevents 413 ───────────────────────
      const MAX_SEND  = 150;
      const sendStep  = Math.max(1, Math.floor(coordinates.length / MAX_SEND));
      const sampledCoords = coordinates.filter((_, i) => i % sendStep === 0);
      if (sampledCoords[sampledCoords.length - 1] !== coordinates[coordinates.length - 1])
        sampledCoords.push(coordinates[coordinates.length - 1]);

      const routeDistanceKm = route.distance / 1000;
      const bufferKm        = Math.max(10, Math.ceil(routeDistanceKm / 100));

      const token = localStorage.getItem("token");
      const stRes = await fetch("http://localhost:8000/api/stations/along-route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ coordinates: sampledCoords, bufferKm }),
      });

      if (!stRes.ok) {
        const errData = await stRes.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${stRes.status}`);
      }

      const stData        = await stRes.json();
      const routeStations = stData.stations || [];

      // ── Premium purple station card popups ─────────────────────────────
      routeStations.forEach((station) => {
        const [sLng, sLat]  = station.location.coordinates;
        const chargerCount  = station.chargers?.length || 0;
        const rating        = station.averageRating ? station.averageRating.toFixed(1) : null;
        const isVerified    = station.isVerified;
        const stars         = rating
          ? "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating))
          : null;

        const popup = new mapboxgl.Popup({ offset: 28, maxWidth: "270px" }).setHTML(`
          <div style="font-family:'Inter',sans-serif;padding:2px">
            <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:10px 10px 0 0;padding:12px 14px;margin:-10px -10px 0">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
                <div style="flex:1;min-width:0">
                  <p style="font-size:13px;font-weight:700;color:#ffffff;margin:0;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    ${station.name}
                  </p>
                  <p style="font-size:10px;color:#94a3b8;margin:3px 0 0">
                    ${station.operator || "Independent Operator"}
                  </p>
                </div>
                ${isVerified ? `
                  <div style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:20px;padding:2px 7px;display:flex;align-items:center;gap:3px;flex-shrink:0">
                    <span style="color:#10b981;font-size:8px">✔</span>
                    <span style="color:#10b981;font-size:9px;font-weight:600">Verified</span>
                  </div>` : ""}
              </div>
            </div>
            <div style="padding:10px 4px 0">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
                <div style="background:#f8fafc;border-radius:8px;padding:7px 10px;text-align:center">
                  <p style="font-size:18px;font-weight:800;color:#8b5cf6;margin:0;line-height:1">${chargerCount}</p>
                  <p style="font-size:9px;color:#64748b;margin:2px 0 0;font-weight:500">CHARGERS</p>
                </div>
                <div style="background:#f8fafc;border-radius:8px;padding:7px 10px;text-align:center">
                  ${rating ? `
                    <p style="font-size:18px;font-weight:800;color:#f59e0b;margin:0;line-height:1">${rating}</p>
                    <p style="font-size:9px;color:#f59e0b;margin:2px 0 0;letter-spacing:1px">${stars}</p>
                  ` : `
                    <p style="font-size:11px;font-weight:600;color:#94a3b8;margin:8px 0 0">No rating</p>
                  `}
                </div>
              </div>
              ${station.address?.city ? `
                <div style="display:flex;align-items:center;gap:5px;margin-bottom:10px">
                  <span style="color:#64748b;font-size:11px">📍</span>
                  <span style="font-size:11px;color:#475569">${[station.address.city, station.address.state].filter(Boolean).join(", ")}</span>
                </div>` : ""}
              <button
                onclick="window.location.href='/stations/${station._id}'"
                style="width:100%;background:linear-gradient(135deg,#10b981,#0d9488);color:white;border:none;padding:9px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;letter-spacing:0.02em;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 12px rgba(16,185,129,0.35)"
                onmouseover="this.style.opacity='0.9'"
                onmouseout="this.style.opacity='1'">
                <span>⚡</span> View Station Details
              </button>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: mkRouteStationDot() })
          .setLngLat([sLng, sLat])
          .setPopup(popup)
          .addTo(map);
        routeStationMarkersRef.current.push(marker);
      });

      setRoutePlannerInfo({
        distance:     (route.distance / 1000).toFixed(1),
        duration:     Math.round(route.duration / 60),
        stationCount: routeStations.length,
      });

    } catch (err) {
      console.error("searchAlongRoute failed:", err);
      setPlannerError(err.message || "Something went wrong. Try again.");
    } finally {
      setPlannerLoading(false);
    }
  }, [sourceInput, destInput, clearTripRoute, clearRouteStationMarkers, hideStationMarkers]);

  // ── startNavigation ───────────────────────────────────────────────────────
  const startNavigation = useCallback(async () => {
    if (!destinationStation) return;
    setGpsLoading(true);
    setGpsError(null);
    try {
      const loc = await getGPS();
      setUserLocation(loc);
      setNavActive(true);
      const map = mapRef.current;
      hideStationMarkers();
      placeUserMarker(loc);
      const [dLng, dLat] = destinationStation.location.coordinates;
      if (destMarkerRef.current) destMarkerRef.current.remove();
      destMarkerRef.current = new mapboxgl.Marker({ element: mkDestPin() })
        .setLngLat([dLng, dLat])
        .setPopup(new mapboxgl.Popup({ offset: 16, maxWidth: "260px" }).setHTML(`
          <div style="font-family:'Inter',sans-serif;padding:10px 4px 4px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <div style="width:32px;height:32px;background:linear-gradient(135deg,#ef4444,#dc2626);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">⚡</div>
              <div>
                <p style="font-size:10px;font-weight:600;color:#ef4444;text-transform:uppercase;letter-spacing:0.08em;margin:0">Destination</p>
                <p style="font-size:12px;font-weight:700;color:#111827;margin:2px 0 0;line-height:1.3">${destinationStation.name}</p>
              </div>
            </div>
          </div>
        `))
        .addTo(map);
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([loc.lng, loc.lat]);
      bounds.extend([dLng, dLat]);
      map.fitBounds(bounds, { padding: { top: 80, bottom: 80, left: 60, right: 60 }, duration: 1200 });
      await drawRoute(loc, { lng: dLng, lat: dLat });
    } catch (err) {
      setGpsError(err.message);
    } finally {
      setGpsLoading(false);
    }
  }, [destinationStation, getGPS, placeUserMarker, hideStationMarkers, drawRoute]);

  // ── Destination pin on prop change ────────────────────────────────────────
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

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [72.8777, 19.076],
      zoom: 6,
    });
    const map = mapRef.current;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(userLoc);
        map.flyTo({ center: [userLoc.lng, userLoc.lat], zoom: 12 });
        placeUserMarker(userLoc);
      },
      () => {}
    );

    map.on("load", async () => {
      setMapLoaded(true);
      try {
        const res      = await fetch("http://localhost:8000/api/stations/map");
        const data     = await res.json();
        const stations = data.stations || [];
        setStationCount(stations.length);

        const addMarkers = (stationList) => {
          stationList.forEach((station) => {
            const [sLng, sLat]  = station.location.coordinates;
            const chargerCount  = station.chargers?.length || 0;
            const rating        = station.averageRating ? station.averageRating.toFixed(1) : null;
            const isVerified    = station.isVerified;
            const stars         = rating
              ? "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating))
              : null;

            const popup = new mapboxgl.Popup({ offset: 28, maxWidth: "270px" }).setHTML(`
              <div style="font-family:'Inter',sans-serif;padding:2px">
                <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:10px 10px 0 0;padding:12px 14px;margin:-10px -10px 0">
                  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
                    <div style="flex:1;min-width:0">
                      <p style="font-size:13px;font-weight:700;color:#ffffff;margin:0;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                        ${station.name}
                      </p>
                      <p style="font-size:10px;color:#94a3b8;margin:3px 0 0">
                        ${station.operator || "Independent Operator"}
                      </p>
                    </div>
                    ${isVerified ? `
                      <div style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:20px;padding:2px 7px;display:flex;align-items:center;gap:3px;flex-shrink:0">
                        <span style="color:#10b981;font-size:8px">✔</span>
                        <span style="color:#10b981;font-size:9px;font-weight:600">Verified</span>
                      </div>` : ""}
                  </div>
                </div>
                <div style="padding:10px 4px 0">
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
                    <div style="background:#f8fafc;border-radius:8px;padding:7px 10px;text-align:center">
                      <p style="font-size:18px;font-weight:800;color:#10b981;margin:0;line-height:1">${chargerCount}</p>
                      <p style="font-size:9px;color:#64748b;margin:2px 0 0;font-weight:500">CHARGERS</p>
                    </div>
                    <div style="background:#f8fafc;border-radius:8px;padding:7px 10px;text-align:center">
                      ${rating ? `
                        <p style="font-size:18px;font-weight:800;color:#f59e0b;margin:0;line-height:1">${rating}</p>
                        <p style="font-size:9px;color:#f59e0b;margin:2px 0 0;letter-spacing:1px">${stars}</p>
                      ` : `
                        <p style="font-size:11px;font-weight:600;color:#94a3b8;margin:8px 0 0">No rating</p>
                      `}
                    </div>
                  </div>
                  ${station.address?.city ? `
                    <div style="display:flex;align-items:center;gap:5px;margin-bottom:10px">
                      <span style="color:#64748b;font-size:11px">📍</span>
                      <span style="font-size:11px;color:#475569">${[station.address.city, station.address.state].filter(Boolean).join(", ")}</span>
                    </div>` : ""}
                  <button
                    onclick="window.location.href='/stations/${station._id}'"
                    style="width:100%;background:linear-gradient(135deg,#10b981,#0d9488);color:white;border:none;padding:9px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;letter-spacing:0.02em;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 12px rgba(16,185,129,0.35)"
                    onmouseover="this.style.opacity='0.9'"
                    onmouseout="this.style.opacity='1'">
                    <span>⚡</span> View Station Details
                  </button>
                </div>
              </div>
            `);

            const marker = new mapboxgl.Marker({ element: mkStationDot() })
              .setLngLat([sLng, sLat])
              .setPopup(popup)
              .addTo(map);
            stationMarkersRef.current.push(marker);
          });
        };

        addMarkers(stations);

        navigator.geolocation?.getCurrentPosition(
          async (pos) => {
            const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setUserLocation(loc);
            map.flyTo({ center: [loc.lng, loc.lat], zoom: 12 });
            placeUserMarker(loc);
            try {
              const nearbyRes  = await fetch(`http://localhost:8000/api/stations/map?lat=${loc.lat}&lng=${loc.lng}&radius=200000`);
              const nearbyData = await nearbyRes.json();
              stationMarkersRef.current.forEach(m => m.remove());
              stationMarkersRef.current = [];
              const nearbyStations = nearbyData.stations || [];
              setStationCount(nearbyStations.length);
              addMarkers(nearbyStations);
            } catch (err) {
              console.error("Nearby stations fetch failed:", err);
            }
          },
          () => {}
        );
      } catch (err) {
        console.error("Stations load failed:", err);
      }
    });

    return () => map.remove();
  }, [placeUserMarker]);

  useEffect(() => {
    if (!mapRef.current) return;
    const timeout = setTimeout(() => { mapRef.current.resize(); }, 510);
    return () => clearTimeout(timeout);
  }, [mapHeight]);

  const handleStyleChange = useCallback((styleObj) => {
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
  }, [navActive, userLocation, destinationStation, drawRoute]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full overflow-hidden">

      {/* MAP */}
      <div className={`relative ${mapHeight} transition-all duration-500 ease-in-out`}>
        <div ref={mapContainer} className="w-full h-full" />

        {!mapLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
            <div className="text-center">
              <FontAwesomeIcon icon={faBolt} className="text-green-500 text-4xl animate-pulse mb-3" />
              <p className="text-gray-600 font-medium">Loading Map...</p>
            </div>
          </div>
        )}

        {(gpsError || plannerError) && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-red-500 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-3 text-sm max-w-xs w-[90%]">
            <span className="flex-1">{gpsError || plannerError}</span>
            <button onClick={() => { setGpsError(null); setPlannerError(null); }}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}

        {/* Style picker */}
        <div className="absolute top-1 left-1 z-20">
          <button onClick={() => setShowPicker(!showPicker)}
            className="bg-white shadow-md rounded-lg px-3 py-2 text-sm font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition">
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

        {mapLoaded && stationCount > 0 && !destinationStation && !routePlannerMode && (
          <div className="absolute bottom-1 right-1 z-20 bg-white shadow-md rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 flex items-center gap-1.5">
            <FontAwesomeIcon icon={faBolt} className="text-green-500" />
            {stationCount} nearby stations
          </div>
        )}

        {routePlannerMode && routePlannerInfo && (
          <div className="absolute bottom-6 right-4 z-20 bg-white shadow-md rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 flex items-center gap-1.5">
            <FontAwesomeIcon icon={faBolt} className="text-purple-500" />
            {routePlannerInfo.stationCount} stations along route
          </div>
        )}

        {!destinationStation && mapLoaded && (
          <button
            onClick={() => routePlannerMode ? clearRoutePlanner() : setRoutePlannerMode(true)}
            className={`absolute bottom-1 left-1 z-20 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-200 active:scale-95
              ${routePlannerMode
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gradient-to-t from-emerald-400 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-200"
              }`}
          >
            <FontAwesomeIcon icon={routePlannerMode ? faXmark : faRoute} />
            {routePlannerMode ? "Cancel Route" : "Plan Route"}
          </button>
        )}
      </div>

      {/* ROUTE PLANNER PANEL */}
      {routePlannerMode && !destinationStation && (
        <div className="w-full shrink-0 bg-white border-t border-gray-100 shadow-2xl">
          <div className="bg-gradient-to-t from-emerald-400 to-teal-600 px-4 py-3 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80 mb-0.5">Route Planner</p>
            <p className="font-bold text-sm leading-tight">Find EV Stations Along Your Route</p>
            <p className="text-xs opacity-70 mt-0.5">Enter source & destination to discover nearby charging stops</p>
          </div>

          <div className="p-4 space-y-3">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm z-10" />
              <input
                type="text"
                value={sourceInput}
                onChange={(e) => setSourceInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchAlongRoute()}
                placeholder="Source (e.g. Mumbai)"
                className="w-full pl-8 pr-20 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <button
                onClick={useGPSForSource}
                disabled={plannerLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-2.5 py-1.5 rounded-lg bg-gradient-to-t from-emerald-400 to-teal-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faLocationCrosshairs} /> GPS
              </button>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white shadow-sm z-10" />
              <input
                type="text"
                value={destInput}
                onChange={(e) => setDestInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchAlongRoute()}
                placeholder="Destination (e.g. Pune)"
                className="w-full pl-8 pr-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>

            <button
              onClick={searchAlongRoute}
              disabled={plannerLoading || !sourceInput.trim() || !destInput.trim()}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-t from-emerald-400 to-teal-600 text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-md hover:shadow-emerald-200"
            >
              {plannerLoading
                ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Searching...</>
                : <><FontAwesomeIcon icon={faMagnifyingGlass} /> Find Stations Along Route</>
              }
            </button>

            {routePlannerInfo && !plannerLoading && (
              <div className="grid grid-cols-3 divide-x divide-gray-100 pt-2 pb-1 border-t border-gray-100">
                <div className="flex flex-col items-center gap-1 px-3">
                  <FontAwesomeIcon icon={faRoad} className="text-blue-500 text-base" />
                  <span className="text-xl font-bold text-gray-800">{routePlannerInfo.distance}</span>
                  <span className="text-xs text-gray-400 -mt-1">km</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-3">
                  <FontAwesomeIcon icon={faClock} className="text-orange-400 text-base" />
                  <span className="text-xl font-bold text-gray-800">{routePlannerInfo.duration}</span>
                  <span className="text-xs text-gray-400 -mt-1">min</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-3">
                  <FontAwesomeIcon icon={faBolt} className="text-purple-500 text-base" />
                  <span className="text-xl font-bold text-gray-800">{routePlannerInfo.stationCount}</span>
                  <span className="text-xs text-gray-400 -mt-1">stations</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NAVIGATION PANEL */}
      {destinationStation && (
        <div className="w-full shrink-0 bg-white border-t border-gray-100 shadow-2xl max-h-[45vh] overflow-y-auto">
          <div className="bg-gradient-to-t from-emerald-400 to-teal-600 px-4 py-3 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80 mb-0.5">Destination</p>
            <p className="font-bold text-sm leading-tight truncate">{destinationStation.name}</p>
            <p className="text-xs opacity-70 mt-0.5">{destinationStation.address?.city}, {destinationStation.address?.state}</p>
          </div>

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

          {userLocation && (
            <div className="mx-4 m-2 bg-blue-50 rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-blue-700">
              <FontAwesomeIcon icon={faLocationCrosshairs} />
              <span className="font-medium">Your GPS location detected</span>
            </div>
          )}

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
      )}

    </div>
  );
}

export default MapView;