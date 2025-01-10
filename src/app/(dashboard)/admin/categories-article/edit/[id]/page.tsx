// pages/admin/categories/edit/[id]/page.tsx
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import { articleCategoryService } from '@/services/articleCategory';
import { ArticleCategory } from '@/types/articleCategory';

const EditCategory = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ArticleCategory>({
    id: '',
    name: '',
    slug: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await articleCategoryService.getById(params.id);
        setFormData(category);
      } catch (error) {
        setError('Failed to fetch category');
      }
    };

    if (params.id) {
      fetchCategory();
    }
  }, [params.id]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await articleCategoryService.update(params.id, formData);
      router.push('/admin/categories-article');
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to update category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Link
                href="/admin/categories"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <FiArrowLeft className="mr-2" /> Back to Categories
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
              <p className="text-gray-600">Update category details</p>
            </div>

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
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
                    required
                  />
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

export default EditCategory;