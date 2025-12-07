// src/components/layout/MainLayout.js
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

const MainLayout = ({ children, title }) => {
  // is screen >= 768 ?
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      setIsSidebarOpen(desktop);   // on small screen -> close
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => {
    if (!isDesktop) setIsSidebarOpen(false);
  };

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
      <main className="main-content">
        <header className="main-header">
          {/* hamburger only on small screen */}
          {!isDesktop && (
            <button className="icon-button" onClick={openSidebar}>
              <FiMenu />
            </button>
          )}
          <h1>{title}</h1>
        </header>
        <section className="main-body">{children}</section>
      </main>
    </div>
  );
};

export default MainLayout;
