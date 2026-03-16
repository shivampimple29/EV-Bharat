function StationApproved() {

  const station = {
    name: "Green Charge Hub",
    address: "MG Road",
    city: "Pune",
    charger: "CCS",
    power: "60kW",
    hours: "24 Hours"
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-6 flex justify-center">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">

        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
          ✅ Station Approved! Your station is now visible to EV users.
        </div>

        <h1 className="text-2xl font-bold mb-6">{station.name}</h1>

        <div className="space-y-4">

          <p><b>Address:</b> {station.address}</p>
          <p><b>City:</b> {station.city}</p>
          <p><b>Charger Type:</b> {station.charger}</p>
          <p><b>Power:</b> {station.power}</p>
          <p><b>Opening Hours:</b> {station.hours}</p>

        </div>

        <div className="flex gap-4 mt-6">

          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
            Edit Station
          </button>

          <button className="bg-gray-300 px-5 py-2 rounded-lg">
            View on Map
          </button>

        </div>

      </div>

    </div>
  );
}

export default StationApproved;