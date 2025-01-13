"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSave, FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import { articleService } from "@/services/article";
import { articleCategoryService } from "@/services/articleCategory";
import type { ArticleCategory } from "@/types/articleCategory";

const AddArticle = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categories: [] as string[],
    slug: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await articleCategoryService.getAll();
        
        // Add validation
        if (!Array.isArray(data)) {
          console.error('Categories data is not an array:', data);
          setError('Invalid categories data received');
          setCategories([]);
          return;
        }

        if (data.length === 0) {
          setError('No categories available. Please create categories first.');
          setCategories([]);
          return;
        }
        
        setCategories(data);
        setError('');
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setCategories([]); // Set empty array as fallback
        setError(err?.response?.data?.message || 'Failed to fetch categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB");
        return;
      }
      setThumbnail(file);
      const objectUrl = URL.createObjectURL(file);
      setThumbnailPreview(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({
      ...formData,
      categories: selectedOptions,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnail) {
      setError("Please upload a thumbnail image");
      return;
    }
    if (formData.categories.length === 0) {
      setError("Please select at least one category");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await articleService.create({
        ...formData,
        thumbnail,
      });
      toast.success('Article created successfully!');
      router.push("/admin/articles");
    } catch (error: any) {
      console.error('Create article error:', error);
      setError(error?.response?.data?.message || "Failed to create article");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/admin/articles"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <FiArrowLeft className="mr-2" /> Back to Articles
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Add New Article</h1>
              <p className="text-gray-600">
                Create a new article with thumbnail and categories
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
                )}

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Thumbnail
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {thumbnailPreview ? (
                        <div className="relative w-full h-48 mx-auto">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="rounded-lg object-cover w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setThumbnail(null);
                              setThumbnailPreview("");
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-700"
                    placeholder="Enter article title"
                  />
                </div>

                {/* Slug Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none text-gray-700"
                  />
                </div>

                {/* Categories Multiple Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories <span className="text-red-500">*</span>
                  </label>
                  {loadingCategories ? (
                    <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
                  ) : categories.length > 0 ? (
                    <select
                      multiple
                      value={formData.categories}
                      onChange={handleCategoriesChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-red-500 text-sm">
                      No categories available. Please create categories first.
                    </div>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Hold Ctrl (Windows) or Command (Mac) to select multiple categories
                  </p>
                </div>

                {/* Content Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Content
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-700"
                    placeholder="Write your article content here..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <Link
                    href="/admin/articles"
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
                    {isLoading ? "Creating..." : "Create Article"}
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

export default AddArticle;
