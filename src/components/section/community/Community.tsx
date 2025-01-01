// Community.tsx
"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUsers,} from 'react-icons/fi';
import Image from 'next/image';
import ChatRoom from './ChatRoom';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  imageUrl: string;
  lastActivity: string;
  isJoined: boolean;
}

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  // Mock data - replace with API call
  const mockCommunities: Community[] = [
    {
      id: '1',
      name: 'First Time Moms',
      description: 'Support group for first-time mothers sharing experiences and advice',
      memberCount: 1234,
      category: 'Support',
      imageUrl: '/communities/first-time-moms.jpg',
      lastActivity: '2 minutes ago',
      isJoined: false
    },
    {
      id: '2',
      name: 'Pregnancy Nutrition',
      description: 'Discuss healthy eating habits and nutritional needs during pregnancy',
      memberCount: 856,
      category: 'Health',
      imageUrl: '/communities/nutrition.jpg',
      lastActivity: '5 minutes ago',
      isJoined: true
    },
    // Add more mock communities...
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCommunities(mockCommunities);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    'all',
    'Support',
    'Health',
    'Exercise',
    'Nutrition',
    'Mental Health'
  ];

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCommunityAction = (community: Community) => {
    if (community.isJoined) {
      setSelectedCommunity(community);
    } else {
      // Handle joining community
      setCommunities(communities.map(c => 
        c.id === community.id ? { ...c, isJoined: true } : c
      ));
    }
  };

  const handleLeaveCommunity = () => {
    if (selectedCommunity) {
      setCommunities(communities.map(c => 
        c.id === selectedCommunity.id ? { ...c, isJoined: false } : c
      ));
      setSelectedCommunity(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pregnancy Support Communities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with other mothers, share experiences, and get support throughout your pregnancy journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-48">
                  <Image
                    src={community.imageUrl}
                    alt={community.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-purple-600">
                    {community.category}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {community.name}
                  </h3>
                  <p className="text-gray-600">
                    {community.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiUsers className="mr-2" />
                      {community.memberCount} members
                    </div>
                    <div>
                      Last active {community.lastActivity}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCommunityAction(community)}
                      className={`w-full py-2 rounded-lg transition-colors ${
                        community.isJoined
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                    >
                      {community.isJoined ? 'Open Community' : 'Join Community'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Room */}
      {selectedCommunity && (
        <ChatRoom 
          community={selectedCommunity}
          onLeave={handleLeaveCommunity}
          onBack={() => setSelectedCommunity(null)}
        />
      )}
    </div>
  );
};

export default CommunityPage;
