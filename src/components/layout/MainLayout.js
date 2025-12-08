import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

const MainLayout = ({ children, title }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

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

          {/* Right side of header – placeholder for future (profile, search, etc.) */}
          <div className="app-header-right">
            <span className="app-header-badge">Admin</span>
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
