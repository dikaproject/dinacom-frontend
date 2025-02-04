// pages/admin/categories/add/page.tsx
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import { productCategoryService } from '@/services/productCategory';

const AddCategory = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await productCategoryService.create(formData);
      router.push('/admin/categories');
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to create category');
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
                href="/admin/categories"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <FiArrowLeft className="mr-2" /> Back to Categories
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Add Category</h1>
              <p className="text-gray-600">Create a new product category</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

<div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug
          </label>
          <input
            type="text"
            value={formData.slug}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900 bg-gray-50"
            required
            readOnly
          />
          <p className="mt-1 text-sm text-gray-500">
            Auto-generated from category name
          </p>
        </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Link
                    href="/admin/categories"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    <FiSave className="mr-2" />
                    {isLoading ? 'Creating...' : 'Create Category'}
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

export default AddCategory;