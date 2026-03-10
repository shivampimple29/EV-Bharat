import { useState } from "react";

function ManageUsers() {

  const [users, setUsers] = useState([
    { id: 1, name: "Rahul", role: "User", status: "Active" },
    { id: 2, name: "Amit", role: "Station Owner", status: "Active" },
    { id: 3, name: "Priya", role: "User", status: "Blocked" }
  ]);

  const toggleBlock = (id) => {

    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Blocked" : "Active"
            }
          : user
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

        <div className="bg-white p-6 rounded-lg shadow">

          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between border-b py-4"
            >

              <div>
                <h2 className="font-semibold">{user.name}</h2>
                <p className="text-gray-500 text-sm">
                  Role: {user.role}
                </p>
                <p className="text-sm">
                  Status: {user.status}
                </p>
              </div>

              <button
                onClick={() => toggleBlock(user.id)}
                className="px-4 py-1 bg-red-500 text-white rounded"
              >
                {user.status === "Active" ? "Block" : "Unblock"}
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default ManageUsers;

