import { useEffect, useMemo, useState } from "react";
import { getAllUsers, deleteUser, updateUserRole } from "../users/users.api";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

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
    } catch (err) {
      if (err.response?.status === 403) toast.error("Access denied. Admins only.");
      else if (err.response?.status === 401) toast.error("You must log in first.");
      else toast.error("Failed to fetch users");
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

  const processedUsers = useMemo(() => {
    let filtered = users.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "newest") filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === "oldest") filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortBy === "role") filtered.sort((a, b) => a.role.localeCompare(b.role));
    return filtered;
  }, [users, search, sortBy]);

  const totalPages = Math.ceil(processedUsers.length / usersPerPage);
  const paginatedUsers = processedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const chartData = [
    { name: "Admins", value: users.filter((u) => u.role === "admin").length, color: "#8b5cf6" },
    { name: "Users", value: users.filter((u) => u.role === "user").length, color: "#3b82f6" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-8 text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">Users Management</h1>
          <p className="text-gray-500 text-sm">Monitor and manage your user base.</p>
        </header>

        {/* Stats Grid - Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-0">
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-4 text-center sm:text-left">Role Distribution</h2>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                    {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-indigo-600 p-6 md:p-8 rounded-2xl shadow-lg text-white flex flex-col justify-center items-center lg:items-start relative overflow-hidden">
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Total Users</p>
            <h2 className="text-5xl md:text-6xl font-black mt-2">{users.length}</h2>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Filters - Stacked on Mobile */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search email..."
              className="w-full pl-4 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-40 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="role">Role</option>
          </select>
        </div>

        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="p-5">Name</th>
                <th className="p-5">Email</th>
                <th className="p-5">Role</th>
                <th className="p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors text-sm">
                  <td className="p-5 flex items-center gap-3 font-medium dark:text-white"><Avatar name={u.name || u.email} /> {u.name || "No Name"}</td>
                  <td className="p-5 text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${u.role === "admin" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>{u.role}</span>
                  </td>
                  <td className="p-5 text-right space-x-2">
                    <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} className="bg-transparent border border-gray-200 dark:border-gray-600 rounded p-1 text-xs dark:text-white outline-none">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={() => setConfirmUser(u)} className="text-red-500 hover:text-red-700 font-bold p-1">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Shown on Mobile only */}
        <div className="md:hidden space-y-4">
          {paginatedUsers.map((u) => (
            <div key={u.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={u.name || u.email} />
                <div className="overflow-hidden">
                  <p className="font-bold dark:text-white truncate">{u.name || "No Name"}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg p-2 text-xs dark:text-white outline-none">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button onClick={() => setConfirmUser(u)} className="bg-red-50 text-red-500 px-3 py-2 rounded-lg text-xs font-bold">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-30 dark:text-white">Prev</button>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl disabled:opacity-30">Next</button>
        </div>
      </div>

      {/* Responsive Modal */}
      {confirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-sm text-center">
            <h3 className="text-lg font-bold dark:text-white mb-2">Delete User?</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to remove <br/><span className="font-bold text-gray-900 dark:text-gray-200">{confirmUser.email}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmUser(null)} className="flex-1 py-2 text-sm font-bold text-gray-500">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 text-sm font-bold bg-red-500 text-white rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Avatar = ({ name }) => {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
      {initials}
    </div>
  );
};

export default UsersPage;