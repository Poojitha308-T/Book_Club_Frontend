import { useEffect, useMemo, useState } from "react";
import { getAllUsers, deleteUser, updateUserRole } from "../users/users.api";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmUser, setConfirmUser] = useState(null);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(confirmUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== confirmUser.id));
      toast.success("User deleted");
      setConfirmUser(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      toast.success("Role updated");
    } catch {
      toast.error("Role update failed");
    }
  };

  // Filter + Sort
  const processedUsers = useMemo(() => {
    let filtered = users.filter((u) =>
      u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "newest") filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === "oldest") filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortBy === "role") filtered.sort((a, b) => a.role.localeCompare(b.role));

    return filtered;
  }, [users, search, sortBy]);

  // Pagination
  const totalPages = Math.ceil(processedUsers.length / usersPerPage);
  const paginatedUsers = processedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Chart Data
  const chartData = [
    { name: "Admins", value: users.filter((u) => u.role === "admin").length },
    { name: "Users", value: users.filter((u) => u.role === "user").length },
  ];

  if (loading) return <div className="p-10 animate-pulse">Loading Users...</div>;

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-all">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Users Management</h1>

      {/* Stats & Chart */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4 dark:text-white">User Roles Overview</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <p className="text-gray-500 dark:text-gray-400">Total Users</p>
          <h2 className="text-4xl font-bold dark:text-white">{users.length}</h2>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by email..."
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="role">Role</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-4">User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="p-4 flex items-center gap-3">
                  <Avatar name={user.name || user.email} />
                  {user.name || "No Name"}
                </td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="space-x-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => setConfirmUser(user)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Prev</button>
        <span>{currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl">
            <p>Delete {confirmUser.email}?</p>
            <div className="flex gap-4 mt-4">
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Confirm</button>
              <button onClick={() => setConfirmUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Avatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
      {initials}
    </div>
  );
};

export default UsersPage;