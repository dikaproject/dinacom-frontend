"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import { userService } from '@/services/user';
import { UserRole, UserFormData } from '@/types/user';

const EditUser = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '', // Optional for edit
    role: UserRole.USER
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userService.getById(params.id);
        setFormData({
          email: user.email,
          password: '', // Don't show existing password
          role: user.role
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const updateData = {
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        ...(formData.password ? { password: formData.password } : {}) // Only include password if provided
      };

      await userService.update(params.id, updateData);
      router.push('/admin/users');
    } catch (error: any) {
      console.error('Update user error:', error);
      setError(error?.response?.data?.message || 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/admin/users"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <FiArrowLeft className="mr-2" /> Back to Users
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
              <p className="text-gray-600">Update user information</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  {/* Email Input */}
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

                  {/* Password Input (Optional for edit) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password <span className="text-gray-400">(leave blank to keep current)</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>

                  {/* Role Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    >
                      {Object.values(UserRole).map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Link
                    href="/admin/users"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-50"
                  >
                    <FiSave className="mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
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

export default EditUser;