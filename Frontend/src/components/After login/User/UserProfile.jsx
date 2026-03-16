import { useState } from "react";

function UserProfile() {

  const [edit, setEdit] = useState(false);

  const [user, setUser] = useState({
    profilePhoto: "https://i.pravatar.cc/300",
    name: "Aryan Patil",
    email: "aryan@gmail.com",
    phone: "9876543210",
    address: "Mumbai, India",
    evBrand: "Tata",
    evModel: "Nexon EV",
    batteryCapacity: "40 kWh",
    connectorType: "CCS2",
    favoriteStation: "Green Charge Hub",
    homeCharging: "Yes",
    preferredNetwork: "Tata Power EZ Charge"
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-15 px-6 py-10 flex justify-center">

      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-8 m-3">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center gap-5">

            <img
              src={user.profilePhoto}
              alt="profile"
              className="w-24 h-24 rounded-full border object-cover"
            />

            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>

          </div>

          <button
            onClick={() => setEdit(!edit)}
            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
          >
            {edit ? "Cancel" : "Edit Profile"}
          </button>

        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm text-gray-600">Address</label>
            <input
              type="text"
              name="address"
              value={user.address}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* EV Brand */}
          <div>
            <label className="text-sm text-gray-600">EV Brand</label>
            <input
              type="text"
              name="evBrand"
              value={user.evBrand}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* EV Model */}
          <div>
            <label className="text-sm text-gray-600">EV Model</label>
            <input
              type="text"
              name="evModel"
              value={user.evModel}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* Battery Capacity */}
          <div>
            <label className="text-sm text-gray-600">Battery Capacity</label>
            <input
              type="text"
              name="batteryCapacity"
              value={user.batteryCapacity}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* Connector Type */}
          <div>
            <label className="text-sm text-gray-600">Connector Type</label>
            <input
              type="text"
              name="connectorType"
              value={user.connectorType}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* Favorite Station */}
          <div>
            <label className="text-sm text-gray-600">Favorite Charging Station</label>
            <input
              type="text"
              name="favoriteStation"
              value={user.favoriteStation}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* Home Charging */}
          <div>
            <label className="text-sm text-gray-600">Home Charging Available</label>
            <select
              name="homeCharging"
              value={user.homeCharging}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          {/* Preferred Network */}
          <div>
            <label className="text-sm text-gray-600">Preferred Charging Network</label>
            <input
              type="text"
              name="preferredNetwork"
              value={user.preferredNetwork}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

        </div>

        {/* Save Button */}
        {edit && (
          <div className="mt-8 text-right">
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
              Save Changes
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

export default UserProfile;