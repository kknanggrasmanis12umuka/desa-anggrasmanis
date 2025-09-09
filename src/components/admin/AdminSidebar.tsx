import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard,
  // Users,
  FileText,
  Calendar,
  Store,
  // MessageSquare,
  // Settings,
  Globe,
  Contact,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Menu,
  X,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Mock user data - dalam implementasi nyata akan dari AuthContext
const currentUser = {
  name: 'Admin Desa',
  email: 'admin@desa.id',
  role: 'ADMIN',
  avatar: null
};

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    current: false,
  },
  // {
  //   name: 'Konten',
  //   icon: FileText,
  //   current: false,
  //   children: [
  //     { name: 'Posts', href: '/admin/posts', icon: FileText },
  //     { name: 'Events', href: '/admin/events', icon: Calendar },
  //   ]
  // },
    {
    name: 'Events',
    href: '/admin/events',
    icon: Calendar,
    current: false,
  },
    {
    name: 'Posts',
    href: '/admin/posts',
    icon: FileText,
    current: false,
  },
  {
    name: 'UMKM',
    href: '/admin/umkm',
    icon: Store,
    current: false,
  },
  {
    name: 'Layanan',
    href: '/admin/layanan',
    icon: BookOpen,
    current: false,
  },
  // {
  //   name: 'Users',
  //   href: '/admin/users',
  //   icon: Users,
  //   current: false,
  //   roles: ['ADMIN'] // Only admin can access
  // },
  {
    name: 'Village Profile',
    href: '/admin/profile',
    icon: Globe,
    current: false,
    roles: ['ADMIN'] // Only admin can access
  },
  {
    name: 'Contacts',
    href: '/admin/contacts',
    icon: Contact,
    current: false,
  },
];

interface SidebarItemProps {
  item: {
    name: string;
    href?: string;
    icon: React.ComponentType<any>;
    children?: Array<{
      name: string;
      href: string;
      icon: React.ComponentType<any>;
    }>;
    roles?: string[];
  };
  isCollapsed: boolean;
  userRole: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, isCollapsed, userRole }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if user has permission to see this item
  if (item.roles && !item.roles.includes(userRole)) {
    return null;
  }
  
  // Check if current path matches this item or its children
  const isCurrentPath = item.href === pathname || 
    (item.children && item.children.some(child => child.href === pathname));
  
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  const baseClasses = `
    flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors
    ${isCurrentPath 
      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }
  `;

  const content = (
    <>
      <item.icon className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`} />
      
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left">{item.name}</span>
          {hasChildren && (
            <span className="ml-auto">
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
        </>
      )}
    </>
  );

  return (
    <div>
      {item.href && !hasChildren ? (
        <Link href={item.href} className={baseClasses} title={isCollapsed ? item.name : undefined}>
          {content}
        </Link>
      ) : (
        <button
          onClick={handleClick}
          className={baseClasses}
          title={isCollapsed ? item.name : undefined}
        >
          {content}
        </button>
      )}

      {/* Sub-menu */}
      {hasChildren && isOpen && !isCollapsed && item.children && (
        <div className="mt-1 ml-6 space-y-1">
          {item.children.map((child) => (
            <Link
              key={child.name}
              href={child.href}
              className={`
                flex items-center px-3 py-2 text-sm rounded-md transition-colors
                ${pathname === child.href
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <child.icon className="w-4 h-4 mr-3" />
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { logout } = useAuth(); // Gunakan hook useAuth

  const handleLogout = () => {
    logout(); // Panggil fungsi logout dari useAuth
    setIsMobileMenuOpen(false); // Tutup menu mobile setelah logout
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} py-4 border-b border-gray-200`}>
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-500">Website Desa</p>
            </div>
          </div>
        )}
        
        <button
          onClick={onToggleCollapse}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md lg:hidden"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.email}
              </p>
              <p className="text-xs text-blue-600 font-medium">
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <SidebarItem 
            key={item.name} 
            item={item} 
            isCollapsed={isCollapsed}
            userRole={currentUser.role}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        {!isCollapsed ? (
          <div className="space-y-2">
            {/* <button
              onClick={() => console.log('Profile clicked')}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
            >
              <User className="w-4 h-4 mr-3" />
              Profil Saya
            </button> */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Keluar
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => console.log('Profile clicked')}
              className="flex items-center justify-center w-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
              title="Profil Saya"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full p-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 ${isCollapsed ? 'lg:w-16' : 'lg:w-64'} transition-all duration-300`}>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
          
          <div className="flex-shrink-0 w-14" />
        </div>
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-white p-2 rounded-md shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};

export default AdminSidebar;