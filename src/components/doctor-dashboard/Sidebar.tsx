"use client"
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Calendar,
  Users,
  Clock,
  MessageCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem('token');
    router.push('/login');
    window.location.reload();
  };

  const menuItems = [
    { name: 'Overview', icon: Home, path: '/doctor' },
    { name: 'Schedule', icon: Calendar, path: '/doctor/schedule' },
    { name: 'Patients', icon: Users, path: '/doctor/patients' },
    { name: 'Appointments', icon: Clock, path: '/doctor/appointments' },
    { name: 'Consultations', icon: MessageCircle, path: '/doctor/consultations' },
    { name: 'Medical Records', icon: FileText, path: '/doctor/records' },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '240px' }}
      className="h-screen bg-white border-r border-gray-200 flex flex-col"
    >
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && (
          <h2 className="font-semibold text-purple-600">MomCare Doctor</h2>
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

      <div className="p-4 border-t space-y-2">
        <Link
          href="/doctor/settings"
          className={`flex items-center space-x-2 p-3 rounded-lg transition-colors text-gray-600 ${
            pathname === '/doctor/settings'
              ? 'bg-purple-100 text-purple-600'
              : 'hover:bg-purple-50'
          }`}
        >
          <Settings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;