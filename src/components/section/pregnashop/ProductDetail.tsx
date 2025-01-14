"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product } from '@/types/shop';
import { shopService } from '@/services/shop';
import { cartService } from '@/services/cart';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await shopService.getProductBySlug(params.slug as string);
        setProduct(data);
      } catch (error) {
        setError('Failed to fetch product details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  const handleAddToCart = async () => {
    try {
        if (!product?.id) {
            throw new Error('Product not found');
        }
        await cartService.addToCart(product.id, quantity);
        toast.success('Added to cart');
        router.push('/cart');
    } catch (error) {
        console.error('Failed to add to cart:', error);
        toast.error('Failed to add to cart');
    }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="h-32 bg-gray-200 rounded mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error || 'Product not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/pregnashop"
          className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-8"
        >
          ← Back to Shop
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Section */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-96 rounded-lg overflow-hidden"
              >
                <img
    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/product/${product.thumbnail}`}
    alt={product.title}
    className="w-full h-full object-cover"
  />
              </motion.div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                <p className="text-2xl text-purple-600 font-semibold">
                  Rp {product.price.toLocaleString()}
                </p>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Category:</h3>
                <p className="text-gray-600">{product.category?.name}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <label className="font-medium text-gray-800">Quantity:</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-600 hover:text-purple-600"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-600 hover:text-purple-600"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
                >
                  <FiShoppingCart className="mr-2" />
                  <span className="text-white">Add to Cart</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;