import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  // Trigger animation when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // only trigger once
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: "fa-solid fa-battery-three-quarters",
      title: "Reduce Range Anxiety",
      description: "Find nearby chargers before your battery runs low — never get stranded again.",
      color: "emerald",
    },
    {
      icon: "fa-solid fa-clock",
      title: "Save Time",
      description: "Check real-time availability and plan your charging stops effortlessly.",
      color: "teal",
    },
    {
      icon: "fa-solid fa-people-group",
      title: "Community Driven",
      description: "Help others by adding new stations to our ever-growing map of India.",
      color: "emerald",
    },
  ];

  const colorMap = {
    emerald: {
      icon:  "bg-emerald-100 text-emerald-600",
      hover: "hover:border-emerald-200 hover:shadow-emerald-100/80",
      glow:  "from-emerald-500/5",
    },
    teal: {
      icon:  "bg-teal-100 text-teal-600",
      hover: "hover:border-teal-200 hover:shadow-teal-100/80",
      glow:  "from-teal-500/5",
    },
  };

  return (
    <section ref={sectionRef}
    id="about"  
    className="bg-gray-50 py-28 px-6 relative overflow-hidden"
      >

      {/* Bg blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96
                      bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72
                      bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto text-center">

        {/* ── Section label — fades in first ── */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5
                        rounded-full bg-emerald-50 border border-emerald-200
                        text-emerald-600 text-xs font-bold
                        uppercase tracking-widest mb-6
                        transition-all duration-500 ease-out
                        ${visible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-3"
                        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          About EV Bharat
        </div>

        {/* ── Heading — slight delay ── */}
        <h2 className={`text-4xl md:text-5xl font-extrabold text-gray-900
                        leading-tight tracking-tight
                        transition-all duration-600 ease-out delay-100
                        ${visible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                        }`}>
          Powering India's{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500
                           bg-clip-text text-transparent">
            Electric Future
          </span>
        </h2>

        {/* ── Description — more delay ── */}
        <p className={`mt-5 text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed
                       transition-all duration-600 ease-out delay-200
                       ${visible
                         ? "opacity-100 translate-y-0"
                         : "opacity-0 translate-y-4"
                       }`}>
          EV Bharat is India's comprehensive platform for locating electric vehicle
          charging stations. Our mission is to accelerate EV adoption by making
          charging infrastructure{" "}
          <span className="text-emerald-600 font-medium">accessible to everyone.</span>
        </p>

        {/* ── Feature Cards — staggered ── */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const c = colorMap[feature.color];
            return (
              <div key={index}
                className={`group relative bg-white rounded-2xl p-6
                            border border-gray-100 shadow-sm text-left
                            overflow-hidden
                            hover:shadow-xl ${c.hover}
                            hover:-translate-y-1
                            transition-all duration-300
                            ${visible
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-6"
                            }`}
                style={{
                  transitionDelay: visible ? `${300 + index * 100}ms` : "0ms",
                  transitionDuration: "600ms",
                }}>

                {/* Accent bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5
                                bg-gradient-to-r from-emerald-400 to-teal-500
                                scale-x-0 group-hover:scale-x-100 origin-left
                                transition-transform duration-500 ease-out" />

                {/* Corner glow */}
                <div className={`absolute top-0 right-0 w-24 h-24
                                 bg-gradient-to-bl ${c.glow} to-transparent
                                 rounded-bl-full opacity-0 group-hover:opacity-100
                                 transition-opacity duration-300 pointer-events-none`} />

                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl ${c.icon}
                                 flex items-center justify-center mb-4
                                 group-hover:scale-110
                                 transition-transform duration-300`}>
                  <i className={`${feature.icon} text-base`} />
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2
                               group-hover:text-emerald-700
                               transition-colors duration-200">
                  {feature.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
