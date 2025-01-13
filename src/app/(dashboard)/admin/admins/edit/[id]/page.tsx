"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { userAdminService } from "@/services/userAdmin";
import { UserRole, UserAdmin } from "@/types/userAdmin";
import { toast } from "react-hot-toast";

const EditAdmin = () => {
    const router = useRouter();
    const params = useParams();
    const adminId = params?.id as string; // Pastikan id terdefinisi sebagai string
    const [formData, setFormData] = useState({
        email: "",
        currentPassword: "",
        password: "",
        confirmPassword: "",
        role: UserRole.ADMIN,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const admin: UserAdmin = await userAdminService.getById(adminId);
                setFormData(prevState => ({
                    ...prevState, // Keep existing state
                    email: admin.email || "",
                    role: admin.role || UserRole.ADMIN,
                    currentPassword: "", // Explicitly set
                    password: "",
                    confirmPassword: "",
                }));
            } catch (err) {
                console.error("Error fetching admin:", err);
                toast.error("Failed to fetch admin data");
                router.push("/admin/admins");
            } finally {
                setIsLoading(false);
            }
        };
    
        if (adminId) fetchAdmin();
    }, [adminId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
    
        try {
            const updateData = {
                email: formData.email,
                role: formData.role,
                currentPassword: formData.currentPassword,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            };
    
            await userAdminService.update(adminId, updateData);
            toast.success("Admin updated successfully");
            router.push("/admin/admins");
        } catch (err: any) {
            const errorMessage = err.message || "Failed to update admin";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <PageWrapper>
            <main className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <Link href="/admin/admins" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                                <FiArrowLeft className="mr-2" /> Back to Administrators
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Administrator</h1>
                            <p className="text-gray-600">Update administrator information</p>
                        </div>

                        {/* Form */}
                        <div className="bg-white rounded-lg shadow-md">
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
    type="password"
    value={formData.currentPassword || ""} // Ensure value is never undefined
    onChange={(e) => setFormData(prev => ({
        ...prev,
        currentPassword: e.target.value
    }))}
    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
/>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password <span className="text-gray-400">(optional)</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                                    />
                                </div>

                                {/* Confirm Password */}
                                {formData.password && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                        />
                                    </div>
                                )}

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-700"
                                    >
                                        {Object.values(UserRole).map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end space-x-4 pt-4">
                                    <Link href="/admin/admins" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-50"
                                    >
                                        <FiSave className="mr-2" />
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </PageWrapper>
    );
};

export default EditAdmin;
