function UserProfile() {

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-6">

      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">

        <h1 className="text-2xl font-bold mb-6">
          User Profile
        </h1>

        {/* User Details */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="text"
          placeholder="Address"
          className="w-full border p-2 mb-3 rounded"
        />

        {/* Saved Locations */}
        <input
          type="text"
          placeholder="Saved Locations"
          className="w-full border p-2 mb-3 rounded"
        />

        {/* Favorite Stations */}
        <input
          type="text"
          placeholder="Favorite Charging Stations"
          className="w-full border p-2 mb-3 rounded"
        />

        {/* Vehicle Details */}
        <input
          type="text"
          placeholder="EV Model"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="text"
          placeholder="Connector Type"
          className="w-full border p-2 mb-3 rounded"
        />

        {/* Language */}
        <select className="w-full border p-2 mb-3 rounded">
          <option>Language</option>
          <option>English</option>
          <option>Hindi</option>
        </select>

        <button className="bg-green-500 text-white px-6 py-2 rounded">
          Save Profile
        </button>

      </div>

    </div>
  );
}

export default UserProfile;