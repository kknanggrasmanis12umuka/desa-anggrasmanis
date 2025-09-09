import React, { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';

interface AdminLayoutProps {
  children?: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title = "Dashboard",
  breadcrumbs = [{ label: "Dashboard" }]
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300`}>
        {/* Header Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Page Title */}
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900 sm:hidden">{title}</h1>
              </div>

              {/* Breadcrumb */}
              <nav className="hidden sm:flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link href="/admin/dashboard" className="hover:text-gray-700">
                      Admin
                    </Link>
                  </li>
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {crumb.href ? (
                        <Link href={crumb.href} className="hover:text-gray-700">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-gray-900 font-medium">{crumb.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* Right side - notifications, user menu, etc */}
            <div className="flex items-center space-x-4">
              {/* Desktop toggle button */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:block p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sidebarCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} />
                </svg>
              </button>

              {/* Notification Bell */}
              <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md relative" title="Notifications">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM21 6l-5-5-5 5h10z" />
                </svg>
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  3
                </span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="h-full">
            {children || <AdminDashboard />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;