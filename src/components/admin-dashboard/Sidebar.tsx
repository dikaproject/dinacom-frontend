"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  UserPlus,
  ShieldPlus,
  BarChart2,
  Stethoscope,
  FolderPlus,
  PackagePlus,
  ChevronLeft,
  ChevronRight,
  LogOut, // For article categories
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    router.push('/login');
    window.location.reload();
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/admin' 
    },
    { 
      name: 'Add User', 
      icon: UserPlus, 
      path: '/admin/users' 
    },
    { 
      name: 'Add Admin', 
      icon: ShieldPlus, 
      path: '/admin/admins' 
    },
    { 
      name: 'Analytics', 
      icon: BarChart2, 
      path: '/admin/analytics' 
    },
    { 
      name: 'Doctor', 
      icon: Stethoscope, 
      path: '/admin/doctors' 
    },
    { 
      name: 'Category Products', 
      icon: FolderPlus, 
      path: '/admin/categories' 
    },
    { 
      name: 'Add Product', 
      icon: PackagePlus, 
      path: '/admin/products' 
    },
    // { 
    //   name: 'Categories Article', 
    //   icon: BookOpen,
    //   path: '/admin/categories-article' 
    // },
    // { 
    //   name: 'Article', 
    //   icon: FileText,
    //   path: '/admin/articles' 
    // },
  ];

  return (
    <>
      {isMobile && isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 p-2 bg-white rounded-lg shadow-lg z-50"
        >
          <ChevronRight size={20} />
        </button>
      )}
      
      <motion.div
        initial={false}
        animate={{ 
          width: isCollapsed ? '80px' : '240px',
          x: isMobile && isCollapsed ? -80 : 0
        }}
        className="h-screen bg-white border-r border-gray-200 flex flex-col fixed md:relative z-40"
      >
        <div className="p-4 flex justify-between items-center">
          {!isCollapsed && (
            <h2 className="font-semibold text-purple-600">PregnaCare</h2>
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
        <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.div>
      
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;