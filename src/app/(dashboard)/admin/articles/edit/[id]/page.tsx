"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { articleService } from '@/services/article';
import { articleCategoryService } from '@/services/articleCategory';
import type { Article } from '@/types/article';
import type { ArticleCategory } from '@/types/articleCategory';
import PageWrapper from '@/components/PageWrapper';

const EditArticle = () => {
  const router = useRouter();
  const params = useParams(); // Gunakan useParams
  const articleId = params.id; // Ambil ID artikel dari params
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categories: [] as string[],
    slug: ''
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (!articleId) {
          setError('No article ID provided');
          return;
        }

        console.log('Loading article:', articleId); // Debug log

        const [articleData, categoriesData] = await Promise.all([
          articleService.getById(articleId as string),
          articleCategoryService.getAll()
        ]);

        console.log('Loaded article:', articleData); // Debug log

        setArticle(articleData);
        setCategories(categoriesData);
        setFormData({
          title: articleData.title,
          content: articleData.content,
          categories: articleData.categories.map((c) => c.slug),
          slug: articleData.slug
        });

        if (articleData.thumbnail) {
          setThumbnailPreview(`/uploads/${articleData.thumbnail}`);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load article data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await articleService.update(articleId, {
        ...formData,
        thumbnail
      });
      router.push('/admin/articles');
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to update article');
    } finally {
      setIsLoading(false);
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
              <a
                href="/admin/articles"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <FiArrowLeft className="mr-2" /> Back to Articles
              </a>
              <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Thumbnail Upload */}
                {/* ...existing thumbnail upload code... */}

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Slug Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                {/* Categories Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <select
                    multiple
                    value={formData.categories}
                    onChange={(e) => {
                      const selected = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setFormData({ ...formData, categories: selected });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
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

export default EditArticle;
