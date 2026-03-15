import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBatteryFull,
  faTemperatureHigh,
  faClock,
  faShieldHalved,
  faCircleCheck,
  faLeaf,
  faGaugeHigh,
  faPlugCircleBolt,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

function ChargingTips() {
  const [visible, setVisible] = useState(false);
  const [safetyVis, setSafetyVis] = useState(false);
  const [bonusVis, setBonusVis] = useState(false);
  const safetyRef = useRef(null);
  const bonusRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const makeObserver = (setter) =>
      new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setter(true);
          }
        },
        { threshold: 0.15 },
      );

    const o1 = makeObserver(setSafetyVis);
    const o2 = makeObserver(setBonusVis);
    if (safetyRef.current) o1.observe(safetyRef.current);
    if (bonusRef.current) o2.observe(bonusRef.current);
    return () => {
      o1.disconnect();
      o2.disconnect();
    };
  }, []);

  const tips = [
    {
      icon: faBolt,
      color: "emerald",
      tag: "Fast Charging",
      title: "Use DC Fast Chargers Wisely",
      desc: "DC fast chargers are great for highway stops but frequent use above 80% accelerates battery degradation. Reserve them for long trips.",
      stat: { value: "80%", label: "Max recommended SOC" },
    },
    {
      icon: faBatteryFull,
      color: "teal",
      tag: "Battery Health",
      title: "Stay in the Sweet Spot",
      desc: "The 20–80% charge window is your battery's happy place. It reduces heat stress and significantly extends overall pack lifespan.",
      stat: { value: "3×", label: "Longer battery life" },
    },
    {
      icon: faTemperatureHigh,
      color: "teal",
      tag: "Temperature",
      title: "Beat the Heat",
      desc: "Lithium batteries degrade faster above 35°C. Pre-condition your car in shade before charging in Indian summers.",
      stat: { value: "35°C", label: "Critical threshold" },
    },
    {
      icon: faClock,
      color: "emerald",
      tag: "Smart Timing",
      title: "Charge at Off-Peak Hours",
      desc: "Charging between 11 PM – 6 AM costs up to 30% less on time-of-use tariffs and puts less strain on the grid.",
      stat: { value: "30%", label: "Potential cost savings" },
    },
  ];

  const safetyTips = [
    {
      icon: faPlugCircleBolt,
      text: "Always use BIS-certified EV charging stations and cables.",
    },
    {
      icon: faShieldHalved,
      text: "Inspect the charging cable for frays or damage before every use.",
    },
    {
      icon: faTriangleExclamation,
      text: "Never charge in waterlogged, flooded, or wet areas.",
    },
    {
      icon: faCircleCheck,
      text: "Follow your vehicle manufacturer's recommended charging profile.",
    },
    {
      icon: faBolt,
      text: "Unplug by pressing the release button — never yank the cable.",
    },
    {
      icon: faLeaf,
      text: "Enable scheduled charging to align with renewable energy peaks.",
    },
  ];

  const bonusFacts = [
    {
      icon: faGaugeHigh,
      title: "Range per Hour",
      value: "25–40 km",
      sub: "on a typical AC home charger",
    },
    {
      icon: faBatteryFull,
      title: "Full Charge Time",
      value: "6–8 hrs",
      sub: "for most EVs on 7.4kW AC",
    },
    {
      icon: faBolt,
      title: "DC Fast Top-up",
      value: "~30 min",
      sub: "for 20–80% on 50kW+ charger",
    },
    {
      icon: faLeaf,
      title: "CO₂ Saved/yr",
      value: "1.5 T",
      sub: "vs equivalent petrol vehicle",
    },
  ];

  const colorMap = {
    emerald: {
      icon: "bg-emerald-100 text-emerald-600",
      tag: "bg-emerald-50 text-emerald-600 border-emerald-200",
      hover: "hover:border-emerald-200 hover:shadow-emerald-100/80",
      glow: "from-emerald-500/5",
      accent: "from-emerald-400 to-teal-500",
      stat: "text-emerald-600",
    },
    teal: {
      icon: "bg-teal-100 text-teal-600",
      tag: "bg-teal-50 text-teal-600 border-teal-200",
      hover: "hover:border-teal-200 hover:shadow-teal-100/80",
      glow: "from-teal-500/5",
      accent: "from-teal-400 to-emerald-500",
      stat: "text-teal-600",
    },
    amber: {
      icon: "bg-amber-100 text-amber-600",
      tag: "bg-amber-50 text-amber-600 border-amber-200",
      hover: "hover:border-amber-200 hover:shadow-amber-100/80",
      glow: "from-amber-500/5",
      accent: "from-amber-400 to-orange-400",
      stat: "text-amber-600",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 px-6 relative overflow-hidden">
      {/* Bg blobs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96
                      bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"
      />
      <div
        className="absolute bottom-0 right-1/4 w-72 h-72
                      bg-teal-100/30 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5
                           rounded-full bg-emerald-50 border border-emerald-200
                           text-emerald-600 text-xs font-bold uppercase tracking-widest mb-5
                           transition-all duration-500
                           ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Charging Guide
          </div>

          <h1
            className={`text-4xl md:text-5xl font-extrabold text-gray-900
                          tracking-tight leading-tight
                          transition-all duration-600 ease-out delay-100
                          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Smarter EV{" "}
            <span
              className="bg-gradient-to-r from-emerald-400 to-teal-500
                             bg-clip-text text-transparent"
            >
              Charging Tips
            </span>
          </h1>

          <div
            className={`h-px w-24 mx-auto mt-3 mb-5
                           bg-gradient-to-r from-transparent via-emerald-400 to-transparent
                           transition-all duration-1000 ease-out delay-300
                           ${visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
          />

          <p
            className={`text-gray-500 text-base leading-relaxed
                         transition-all duration-600 ease-out delay-200
                         ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            Maximize your EV's battery life, cut charging costs, and charge
            safely with these{" "}
            <span className="text-emerald-600 font-semibold">
              expert-backed tips
            </span>{" "}
            built for Indian conditions.
          </p>
        </div>

        {/* ── Tips Grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {tips.map((tip, i) => {
            const c = colorMap[tip.color];
            return (
              <div
                key={i}
                className={`group relative bg-white rounded-2xl p-6
                            border border-gray-100 shadow-sm overflow-hidden text-left
                            hover:shadow-xl hover:-translate-y-1 ${c.hover}
                            transition-all duration-300
                            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{
                  transitionDelay: visible ? `${300 + i * 100}ms` : "0ms",
                  transitionDuration: "600ms",
                }}
              >
                {/* Accent bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5
                                 bg-gradient-to-r ${c.accent}
                                 scale-x-0 group-hover:scale-x-100 origin-left
                                 transition-transform duration-500`}
                />

                {/* Corner glow */}
                <div
                  className={`absolute top-0 right-0 w-20 h-20
                                 bg-gradient-to-bl ${c.glow} to-transparent
                                 rounded-bl-full opacity-0 group-hover:opacity-100
                                 transition-opacity duration-300 pointer-events-none`}
                />

                {/* Tag */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1
                                 rounded-full border text-[10px] font-bold
                                 uppercase tracking-wider mb-4 ${c.tag}`}
                >
                  <span className="w-1 h-1 rounded-full bg-current" />
                  {tip.tag}
                </div>

                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl ${c.icon}
                                 flex items-center justify-center mb-4
                                 group-hover:scale-110 transition-transform duration-300`}
                >
                  <FontAwesomeIcon icon={tip.icon} className="text-base" />
                </div>

                <h2
                  className="text-sm font-bold text-gray-900 mb-2
                               group-hover:text-emerald-700
                               transition-colors duration-200 leading-snug"
                >
                  {tip.title}
                </h2>

                <p className="text-gray-500 text-xs leading-relaxed mb-5">
                  {tip.desc}
                </p>

                {/* Stat chip */}
                <div
                  className="flex items-center gap-2 pt-4
                                border-t border-gray-100"
                >
                  <span className={`text-lg font-extrabold ${c.stat}`}>
                    {tip.stat.value}
                  </span>
                  <span className="text-gray-400 text-[10px] leading-tight">
                    {tip.stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Quick Facts Banner ── */}

        <div
          ref={bonusRef}
          className={`relative bg-gradient-to-br from-emerald-50 to-teal-50
               rounded-2xl border border-emerald-100
               overflow-hidden p-8 mb-10
               transition-all duration-700 ease-out
               ${bonusVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Soft radial glow at top */}
          <div
            className="absolute inset-0
                  bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_60%)]
                  pointer-events-none"
          />

          <div className="relative flex items-center gap-2 mb-7">
            <div
              className="w-8 h-8 rounded-lg bg-white border border-emerald-200
                    shadow-sm flex items-center justify-center"
            >
              <FontAwesomeIcon
                icon={faBolt}
                className="text-emerald-500 text-xs"
              />
            </div>
            <h2 className="text-gray-900 font-bold text-base">
              Quick Charging Facts
            </h2>
            <span className="text-gray-400 text-xs ml-1">
              — know your numbers
            </span>
          </div>

          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4">
            {bonusFacts.map((fact, i) => (
              <div
                key={i}
                className="group bg-white/70 border border-emerald-100 rounded-xl p-4
                   hover:bg-white hover:border-emerald-200
                   hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-100
                   transition-all duration-200 cursor-default"
                style={{ transitionDelay: `${bonusVis ? i * 80 : 0}ms` }}
              >
                <div
                  className="w-8 h-8 rounded-lg bg-emerald-100
                        flex items-center justify-center mb-3
                        group-hover:bg-emerald-200
                        transition-colors duration-200"
                >
                  <FontAwesomeIcon
                    icon={fact.icon}
                    className="text-emerald-600 text-xs"
                  />
                </div>
                <p
                  className="text-[10px] text-gray-400 font-semibold
                      uppercase tracking-wider mb-1"
                >
                  {fact.title}
                </p>
                <p
                  className="text-2xl font-extrabold
                      bg-gradient-to-r from-emerald-500 to-teal-500
                      bg-clip-text text-transparent leading-none mb-1"
                >
                  {fact.value}
                </p>
                <p className="text-gray-400 text-[10px] leading-snug">
                  {fact.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Safety Section ── */}
        <div
          ref={safetyRef}
          className={`bg-white rounded-2xl border border-gray-100
                      shadow-sm overflow-hidden
                      transition-all duration-700 ease-out
                      ${safetyVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />

          <div className="p-8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600
                              flex items-center justify-center shrink-0"
              >
                <FontAwesomeIcon icon={faShieldHalved} className="text-base" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  Safety First
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Protect yourself, your vehicle, and your battery
                </p>
              </div>
            </div>

            <div
              className="h-px bg-gradient-to-r from-emerald-100
                            via-gray-100 to-transparent my-6"
            />

            <ul className="grid sm:grid-cols-2 gap-3">
              {safetyTips.map((tip, i) => (
                <li
                  key={i}
                  className="group flex items-start gap-3 p-4 rounded-xl
                             bg-gray-50 border border-gray-100
                             hover:bg-emerald-50 hover:border-emerald-100
                             hover:-translate-y-0.5 hover:shadow-sm
                             transition-all duration-200 cursor-default"
                  style={{
                    transitionDelay: safetyVis ? `${i * 80}ms` : "0ms",
                    opacity: safetyVis ? 1 : 0,
                    transform: safetyVis ? "translateY(0)" : "translateY(12px)",
                    transition: "all 0.5s ease",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg bg-white border border-gray-200
                                  flex items-center justify-center shrink-0
                                  group-hover:bg-emerald-100 group-hover:border-emerald-200
                                  transition-all duration-200"
                  >
                    <FontAwesomeIcon
                      icon={tip.icon}
                      className="text-gray-400 group-hover:text-emerald-600
                                 text-xs transition-colors duration-200"
                    />
                  </div>
                  <p
                    className="text-gray-600 text-sm leading-relaxed
                                group-hover:text-gray-700 transition-colors duration-200"
                  >
                    {tip.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChargingTips;
