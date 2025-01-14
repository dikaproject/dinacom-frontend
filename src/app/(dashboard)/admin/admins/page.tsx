// pages/admin/admins/page.tsx
"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { userAdminService } from "@/services/userAdmin";
import { UserAdmin } from "@/types/userAdmin";
import { toast } from "react-hot-toast";

const AdminList = () => {
  const [admins, setAdmins] = useState<UserAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await userAdminService.getAll();
      setAdmins(data);
      setError(""); // Clear error on success
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to fetch admins. Please try again.");
      toast.error("Failed to load admins, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await userAdminService.delete(id);
        setAdmins(admins.filter((admin) => admin.id !== id));
        toast.success("Admin deleted successfully");
      } catch (err) {
        console.error("Error deleting admin:", err);
        toast.error("Failed to delete admin");
      }
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <PageWrapper>
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div>Loading...</div>
        </main>
      </PageWrapper>
    );
  }

  if (!isLoading && error) {
    return (
      <PageWrapper>
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-red-600 font-semibold">{error}</p>
            <button
              onClick={fetchAdmins}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </main>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Administrators</h1>
            <p className="text-gray-600">Manage system administrators</p>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full sm:w-auto relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
            <Link
              href="/admin/admins/add"
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
            >
              <FiPlus className="mr-2" /> Add Admin
            </Link>
          </div>

          {/* Admins Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
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
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{admin.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            admin.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/admins/edit/${admin.id}`}
                          className="text-purple-600 hover:text-purple-900 mr-4"
                        >
                          <FiEdit2 className="inline-block w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="inline-block w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredAdmins.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No admins found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default AdminList;
