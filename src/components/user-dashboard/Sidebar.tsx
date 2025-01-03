"use client"
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Calendar,
  Activity,
  Coffee,
  Heart,
  MessageCircle,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', icon: Home, path: '/dashboard' },
    { name: 'Daily Checkup', icon: Calendar, path: '/dashboard/checkup' },
    { name: 'Health Tracking', icon: Activity, path: '/dashboard/health' },
    { name: 'Nutrition', icon: Coffee, path: '/dashboard/nutrition' },
    { name: 'Exercise', icon: Heart, path: '/dashboard/exercise' },
    { name: 'Consultation', icon: MessageCircle, path: '/dashboard/consultation' },
    { name: 'Reminders', icon: Bell, path: '/dashboard/reminders' },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '240px' }}
      className="h-screen bg-white border-r border-gray-200 flex flex-col"
    >
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && (
          <h2 className="font-semibold text-purple-600">MomCare</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-purple-50"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center space-x-2 p-3 rounded-lg transition-colors text-gray-600 ${
              pathname === item.path
                ? 'bg-purple-100 text-purple-600'
                : 'hover:bg-purple-50'
            }`}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Link
          href="/dashboard/settings"
          className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50"
        >
          <Settings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </motion.div>
  );
};

export default Sidebar;