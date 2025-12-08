import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { FiMenu, FiBell, FiSun } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const MainLayout = ({ children, title }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const { user } = useAuth(); // 👈 get current user from context

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      setIsSidebarOpen(desktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => {
    if (!isDesktop) setIsSidebarOpen(false);
  };

  const currentYear = new Date().getFullYear();

  const userName = user?.name || 'User';
  const userRole = user?.role?.name || 'Admin';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Sidebar
        isDesktop={isDesktop}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Dark overlay on mobile */}
      {!isDesktop && isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar} />
      )}

      {/* Main area */}
      <div className="main-wrapper">
        {/* Top header bar */}
        <header className="app-header">
          <div className="app-header-left">
            {!isDesktop && (
              <button className="icon-button" onClick={openSidebar}>
                <FiMenu />
              </button>
            )}
            <div>
              <h1 className="app-header-title">{title}</h1>
              <p className="app-header-subtitle">News Admin Panel</p>
            </div>
          </div>

          {/* Right side of header – now using real user info */}
          <div className="app-header-right">
            <button className="header-icon-btn" type="button">
              <FiBell />
              <span className="header-icon-dot" />
            </button>

            <button className="header-icon-btn" type="button">
              <FiSun />
            </button>

            <div className="header-divider" />

            <div className="header-user">
              <div className="header-user-meta">
                <span className="header-user-name">{userName}</span>
                <span className="header-user-role">{userRole}</span>
              </div>
              <div className="header-avatar">{userInitial}</div>
            </div>
          </div>
        </header>

        {/* Page content + footer */}
        <main className="main-content">
          <div className="main-inner">
            <section className="main-body">{children}</section>

            <footer className="main-footer">
              <span>© {currentYear} News Admin. All rights reserved.</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
