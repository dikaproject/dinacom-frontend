"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import PageWrapper from '@/components/PageWrapper';
import { productService } from '@/services/product';
import { productCategoryService } from '@/services/productCategory';
import { ProductCategory } from '@/types/productCategory';
import { use } from 'react';

interface EditProductProps {
  params: Promise<{ id: string }>;
}

const EditProduct = ({ params }: EditProductProps) => {
  const router = useRouter();
  const { id } = use(params);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    productStatus: '',
    price: '',
    categoryId: ''
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoriesData] = await Promise.all([
          productService.getById(id),
          productCategoryService.getAll()
        ]);

        setFormData({
          title: productData.title,
          slug: productData.slug,
          description: productData.description,
          productStatus: productData.productStatus,
          price: productData.price.toString(),
          categoryId: productData.categoryId
        });
        setThumbnailPreview(productData.thumbnail);
        setCategories(categoriesData);
      } catch (error) {
        setError('Failed to fetch product data');
      }
    };

    fetchData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      if (thumbnail) {
        formDataToSend.append('thumbnail', thumbnail);
      }

      await productService.update(id, formDataToSend);
      router.push('/admin/products');
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to update product');
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
                href="/admin/products"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <FiArrowLeft className="mr-2" /> Back to Products
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600">Update product details</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Thumbnail
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {thumbnailPreview ? (
                        <div className="relative w-40 h-40 mx-auto">
                          <Image
                            src={thumbnailPreview}
                            alt="Preview"
                            fill
                            className="rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setThumbnail(null);
                              setThumbnailPreview('');
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.productStatus}
                      onChange={(e) => setFormData({ ...formData, productStatus: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="UNACTIVE">Unactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Link
                    href="/admin/products"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                    <FiSave className="ml-2 inline-block" />
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

export default EditProduct;