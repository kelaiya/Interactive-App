import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const inputRef = useRef(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    if (editingId) {
      await axios.put(`/api/users/${editingId}`, { name, email });
      setEditingId(null);
    } else {
      await axios.post("/api/users", { name, email });
    }

    setName("");
    setEmail("");
    fetchUsers();
    inputRef.current.focus();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/users/${id}`);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditingId(user.id);
    inputRef.current.focus();
  };

  const userCount = useMemo(() => users.length, [users]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center py-10">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 px-4">

        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit User" : "Add User"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              {editingId ? "Update User" : "Add User"}
            </button>
          </form>
        </div>

        {/* Users */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            Users ({userCount})
          </h3>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex justify-between items-center border p-3 rounded-lg hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-3 py-1 bg-yellow-400 rounded-md hover:bg-yellow-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;