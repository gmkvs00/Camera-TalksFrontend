import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  {
    label: 'Dashboard',
    icon: <FiHome />,
    path: '/dashboard',
    permission: 'mes.dashboard',
  },
  {
    label: 'News',
    icon: <FiFileText />,
    path: '/news',
    permission: 'news.browse', 
  },
  {
    label: 'Admin Settings',
    icon: <FiSettings />,
    key: 'settings',
    permission: null,
    children: [
      {
        label: 'Users',
        icon: <FiUsers />,
        path: '/settings/users',
        permission: 'user.browse',
      },
      {
        label: 'Roles',
        icon: <FiUsers />,
        path: '/settings/roles',
        permission: 'role.browse', 
      },
    ],
  },
  {
    label: 'Reports',
    icon: <FiBarChart2 />,
    path: '/reports',
    permission: 'report.browse',
  },
];

const Sidebar = ({ isDesktop, isOpen, onClose }) => {
  const { user, hasPermission, logout } = useAuth();
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  useEffect(() => {
    const newOpen = {};

    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) =>
          location.pathname.startsWith(child.path)
        );
        if (hasActiveChild) {
          newOpen[item.key] = true;
        }
      }
    });

    setOpenMenus((prev) => ({ ...prev, ...newOpen }));
  }, [location.pathname]); // ✅ menuItems is static, no need in deps

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sidebarClass =
    'sidebar ' +
    (!isDesktop ? (isOpen ? 'sidebar-open' : 'sidebar-hidden') : '');

  return (
    <aside className={sidebarClass} onClick={(e) => e.stopPropagation()}>
      <div className="sidebar-header">
        <div className="logo-box">N</div>
        <span className="logo-text">News Admin</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          // simple single link
          if (!item.children) {
            if (!hasPermission(item.permission)) return null;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  'sidebar-link' + (isActive ? ' active' : '')
                }
                onClick={!isDesktop ? onClose : undefined}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          }

          // with submenu
          const visibleChildren = item.children.filter((child) =>
            hasPermission(child.permission)
          );
          if (!hasPermission(item.permission) || visibleChildren.length === 0) {
            return null;
          }

          const isOpenMenu = openMenus[item.key];
          const childActive = visibleChildren.some((child) =>
            location.pathname.startsWith(child.path)
          );

          const parentClasses =
            'sidebar-link sidebar-parent' + (childActive ? ' active' : '');

          return (
            <div key={item.key} className="sidebar-group">
              <div
                className={parentClasses}
                onClick={() => toggleMenu(item.key)}
              >
                <span className="icon">{item.icon}</span>
                <span className="grow">{item.label}</span>
                <span className="chevron">
                  {isOpenMenu ? <FiChevronDown /> : <FiChevronRight />}
                </span>
              </div>

              {isOpenMenu && (
                <div className="sidebar-submenu">
                  {visibleChildren.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        'sidebar-sublink' + (isActive ? ' active' : '')
                      }
                      onClick={!isDesktop ? onClose : undefined}
                    >
                      <span className="icon small">{child.icon}</span>
                      <span>{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role?.name}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
