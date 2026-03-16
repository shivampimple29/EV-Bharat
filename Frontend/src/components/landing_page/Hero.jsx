import { useEffect, useState } from "react";

function Hero() {
  const [visible, setVisible] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    // Small delay so browser paints first, then animates in
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { value: "10,000+", label: "Charging Stations", icon: "fa-solid fa-charging-station" },
    { value: "500+",    label: "Cities Covered",    icon: "fa-solid fa-city"             },
    { value: "50M+",    label: "kWh Delivered",     icon: "fa-solid fa-bolt"             },
    { value: "24/7",    label: "Availability",      icon: "fa-solid fa-clock"            },
  ];

  return (
    <section
      className="relative overflow-hidden bg-slate-950 text-white
                 [background-image:linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)]
                 [background-size:96px_96px]"
    >
      {/* ── Glows ── */}
      <div className="absolute inset-0
                      bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_40%)]
                      pointer-events-none" id="/" />
      <div className="absolute inset-0
                      bg-[radial-gradient(circle_at_80%_80%,rgba(20,184,166,0.10),transparent_40%)]
                      pointer-events-none" />

      {/* ── Electric arc lines (decorative) ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
        xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="30%" x2="100%" y2="10%"
          stroke="url(#arcGrad)" strokeWidth="1" />
        <line x1="0" y1="70%" x2="100%" y2="50%"
          stroke="url(#arcGrad)" strokeWidth="0.5" />
        <line x1="20%" y1="0" x2="40%" y2="100%"
          stroke="url(#arcGrad)" strokeWidth="0.5" />
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%"  stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── Floating orbs ── */}
      <div className="absolute top-20 left-10 w-64 h-64
                      bg-emerald-500/5 rounded-full blur-3xl
                      animate-[pulse_6s_ease-in-out_infinite]
                      pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80
                      bg-teal-500/5 rounded-full blur-3xl
                      animate-[pulse_8s_ease-in-out_infinite]
                      pointer-events-none" />

      {/* ── Spark particles ── */}
      {[...Array(6)].map((_, i) => (
        <div key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-emerald-400
                     animate-[ping_3s_ease-in-out_infinite]
                     pointer-events-none"
          style={{
            top:              `${15 + i * 14}%`,
            left:             `${8 + i * 15}%`,
            animationDelay:   `${i * 0.6}s`,
            animationDuration:`${2 + i * 0.4}s`,
            opacity: 0.6,
          }} />
      ))}

      {/* ── Content ── */}
      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">

        {/* Badge */}
        <div className={`inline-flex items-center gap-2.5
                        bg-white/5 border border-white/10
                        backdrop-blur-sm rounded-full
                        px-4 py-2 text-sm text-gray-300 mb-10
                        hover:bg-white/8 hover:border-white/20
                        transition-all duration-700 ease-out cursor-default
                        ${visible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                        }`}>
          <span className="w-5 h-5 rounded-full
                           bg-gradient-to-br from-emerald-400 to-teal-500
                           flex items-center justify-center
                           animate-[pulse_2s_ease-in-out_infinite]">
            <i className="fa-solid fa-bolt text-[9px] text-white" />
          </span>
          Powering India's EV Revolution
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Heading */}
        <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold
                        leading-tight tracking-tight
                        transition-all duration-700 ease-out delay-100
                        ${visible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-5"
                        }`}>
          Find EV Charging
        </h1>

        <span className={`block text-5xl sm:text-6xl md:text-7xl font-extrabold
                          bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400
                          bg-clip-text text-transparent
                          leading-tight tracking-tight mt-1
                          drop-shadow-[0_0_60px_rgba(16,185,129,0.4)]
                          transition-all duration-700 ease-out delay-200
                          ${visible
                            ? "opacity-100 translate-y-0 blur-none"
                            : "opacity-0 translate-y-5 blur-sm"
                          }`}>
          Stations Near You
        </span>

        {/* Electric underline */}
        <div className={`mx-auto mt-3 h-px max-w-xs
                         bg-gradient-to-r from-transparent via-emerald-400 to-transparent
                         transition-all duration-1000 ease-out delay-500
                         ${visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`} />

        {/* Subtitle */}
        <p className={`mt-7 text-gray-400 max-w-xl mx-auto text-base sm:text-lg
                       leading-relaxed
                       transition-all duration-700 ease-out delay-300
                       ${visible
                         ? "opacity-100 translate-y-0"
                         : "opacity-0 translate-y-4"
                       }`}>
          Discover{" "}
          <span className="text-emerald-400 font-semibold">10,000+</span>{" "}
          charging stations across India. Fast, reliable, and always available
          when you need them.
        </p>

        {/* ── Search bar ── */}
        <div className={`relative mt-12 max-w-2xl mx-auto group
                         transition-all duration-700 ease-out delay-[400ms]
                         ${visible
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 translate-y-5"
                         }`}>
          {/* Glow */}
          <div className="absolute -inset-1 rounded-2xl
                          bg-gradient-to-r from-emerald-400 to-teal-500
                          blur opacity-30 group-hover:opacity-60
                          transition-all duration-500 ease-in-out" />

          <div className="relative bg-white/95 rounded-2xl p-2.5
                          flex flex-col sm:flex-row items-center gap-2.5
                          shadow-2xl shadow-emerald-900/20">

            <div className="hidden sm:flex w-10 h-10 rounded-xl ml-1
                            bg-emerald-50 border border-emerald-100
                            items-center justify-center shrink-0">
              <i className="fa-solid fa-location-dot text-emerald-500 text-sm" />
            </div>

            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search by city, area, or station name..."
              className="flex-1 bg-transparent outline-none px-3 py-2.5
                         text-gray-800 placeholder-gray-400 text-sm w-full" />

            <div className="hidden sm:block w-px h-8 bg-gray-200 shrink-0" />

            <button className="w-full sm:w-auto
                               bg-gradient-to-r from-emerald-500 to-teal-500
                               text-white px-6 py-3 rounded-xl
                               text-sm font-semibold
                               shadow-md shadow-emerald-900/20
                               hover:shadow-lg hover:shadow-emerald-500/30
                               hover:scale-105 hover:brightness-110
                               active:scale-95
                               transition-all duration-200
                               flex items-center justify-center gap-2 shrink-0">
              <i className="fa-solid fa-magnifying-glass text-xs" />
              Search
            </button>
          </div>
        </div>

        {/* Quick city filters */}
        <div className={`flex items-center justify-center flex-wrap gap-2 mt-4
                         transition-all duration-700 ease-out delay-500
                         ${visible
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 translate-y-3"
                         }`}>
          {["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai"].map((city, i) => (
            <button key={city}
              className="px-3 py-1.5 rounded-full
                         bg-white/5 border border-white/10
                         text-gray-400 text-xs font-medium
                         hover:bg-emerald-500/10 hover:border-emerald-500/30
                         hover:text-emerald-400 hover:scale-105
                         active:scale-95
                         transition-all duration-200"
              style={{ transitionDelay: `${500 + i * 60}ms` }}>
              {city}
            </button>
          ))}
        </div>

        {/* ── Stats ── */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <div key={stat.label}
              className={`group relative p-5 rounded-2xl
                          bg-white/3 border border-white/8
                          hover:bg-white/6 hover:border-emerald-500/20
                          hover:-translate-y-1
                          hover:shadow-lg hover:shadow-emerald-900/20
                          transition-all duration-300 cursor-default
                          ${visible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-6"
                          }`}
              style={{
                transitionDelay:    `${600 + i * 100}ms`,
                transitionDuration: "700ms",
              }}>

              {/* Corner glow */}
              <div className="absolute inset-0 rounded-2xl
                              bg-gradient-to-br from-emerald-500/5 to-transparent
                              opacity-0 group-hover:opacity-100
                              transition-opacity duration-300 pointer-events-none" />

              {/* Icon */}
              <div className="w-8 h-8 rounded-lg
                              bg-emerald-500/10 border border-emerald-500/20
                              flex items-center justify-center mx-auto mb-3
                              group-hover:bg-emerald-500/20
                              group-hover:scale-110
                              transition-all duration-300">
                <i className={`${stat.icon} text-emerald-400 text-xs`} />
              </div>

              <p className="text-3xl font-extrabold
                            bg-gradient-to-r from-emerald-300 to-teal-300
                            bg-clip-text text-transparent mb-1">
                {stat.value}
              </p>
              <p className="text-gray-400 text-[10px] font-semibold
                            uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Hero;
