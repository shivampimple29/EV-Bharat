export default function AboutSection() {
  const features = [
    {
      title: "Reduce Range Anxiety",
      description: "Find nearby chargers before your battery runs low"
    },
    {
      title: "Save Time",
      description: "Check availability and plan your charging stops"
    },
    {
      title: "Community Driven",
      description: "Help others by adding new stations to our map"
    }
  ];

  return (
    <section className="bg-gray-50 py-28 px-6" id="about">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          Powering India's{" "}
          <span className="bg-gradient-to-t from-emerald-300 to-teal-500 bg-clip-text text-transparent">Electric Future</span>
        </h2>

        {/* Description */}
        <p className="mt-6 text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
          EV Bharat is India's comprehensive platform for locating
          electric vehicle charging stations. Our mission is to accelerate EV
          adoption by making charging infrastructure accessible to everyone.
        </p>

        {/* Feature Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {feature.title}
              </h3>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}