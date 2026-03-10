import { Link } from "react-router-dom";

function AdminDashboard() {

  const stats = {
    stations: 24,
    users: 180,
    pendingStations: 5
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500">Total Stations</h2>
            <p className="text-3xl font-bold">{stats.stations}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500">Active Users</h2>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500">Pending Approvals</h2>
            <p className="text-3xl font-bold">{stats.pendingStations}</p>
          </div>

        </div>

        {/* Navigation */}
        <div className="flex gap-4">

          <Link
            to="/manage-stations"
            className="bg-green-500 text-white px-6 py-3 rounded-lg"
          >
            Manage Stations
          </Link>

          <Link
            to="/manage-users"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg"
          >
            Manage Users
          </Link>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;

