// components/section/News.tsx
"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock,  FiCalendar } from 'react-icons/fi';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishDate: string;
  author: {
    name: string;
    avatar: string;
  };
  image: string;
  isFeatured?: boolean;
}

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleArticles, setVisibleArticles] = useState(7);

  // Mock articles data
  const articles: Article[] = [
    {
      id: 1,
      title: "Essential Nutrition Tips During Pregnancy",
      excerpt: "Learn about the most important nutrients and dietary guidelines for a healthy pregnancy...",
      category: "Nutrition",
      readTime: "5 min",
      publishDate: "2024-03-15",
      author: {
        name: "Dr. Sarah Johnson",
        avatar: "/authors/sarah.jpg"
      },
      image: "/articles/nutrition.jpg",
      isFeatured: true
    },
    // Add more articles...
  ];

  const categories = ['all', ...new Set(articles.map(article => article.category))];

  const filteredArticles = articles.filter(article => 
    selectedCategory === 'all' || article.category === selectedCategory
  );

  const loadMore = () => {
    setVisibleArticles(prev => prev + 6);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Articles
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest pregnancy and maternal health insights
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8 space-x-4 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Article */}
          {filteredArticles.find(article => article.isFeatured) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2 lg:col-span-3"
            >
              <Link href={`/articles/${filteredArticles[0].id}`}>
                <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-[400px]">
                    <Image
                      src={filteredArticles[0].image}
                      alt={filteredArticles[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="inline-block px-3 py-1 bg-purple-600 rounded-full text-xs font-semibold mb-3">
                      {filteredArticles[0].category}
                    </span>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-200 transition-colors">
                      {filteredArticles[0].title}
                    </h3>
                    <p className="text-gray-200 mb-4">{filteredArticles[0].excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        {filteredArticles[0].readTime}
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" />
                        {new Date(filteredArticles[0].publishDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Regular Articles */}
          {filteredArticles.slice(1, visibleArticles).map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/articles/${article.id}`}>
                <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold mb-3">
                      {article.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={article.author.avatar}
                          alt={article.author.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{article.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <FiClock className="mr-1" />
                          {article.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleArticles < filteredArticles.length && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Load More Articles
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default News;