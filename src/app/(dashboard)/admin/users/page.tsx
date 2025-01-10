// pages/admin/users/page.tsx
"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUser } from "react-icons/fi";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { userService } from "@/services/user";
import { User, UserRole } from "@/types/user";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        console.log("Fetched users:", data); 
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.delete(id);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-purple-100 text-purple-800";
      case UserRole.DOCTOR:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600">Manage system users</p>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full sm:w-auto relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
              />
            </div>
            <Link
              href="/admin/users/add"
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
            >
              <FiPlus className="mr-2" /> Add User
            </Link>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm text-gray-500">
                            {user.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/users/edit/${user.id}`}
                        className="text-purple-600 hover:text-purple-900 mr-4"
                      >
                        <FiEdit2 className="inline-block w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="inline-block w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default UsersList;
