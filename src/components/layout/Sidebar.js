import React, { useEffect, useState } from 'react';
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
  FiKey,
  FiGlobe,
  FiImage,
  FiMessageSquare,
  FiCopy,
  FiMenu,
  FiTag,
  FiFolder,
  FiSliders,
  FiClock,
  FiFilePlus,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  {
    label: 'Dashboard',
    icon: <FiHome />,
    path: '/dashboard',
    permission: null,
  },
  {
    label: 'News',
    icon: <FiGlobe />,
    path: '/news',
    permission: 'news.browse',
  },
  {
    label: 'Articles',
    icon: <FiFileText />,
    key: 'articles',
    permission: 'developer.browse',
    children: [
      {
        label: 'All Articles',
        icon: <FiFileText />,
        path: '/comming-soon',
        permission: 'developer.browse',
      },
      {
        label: 'Create Article',
        icon: <FiFilePlus />,
        path: '/comming-soon',
        permission: 'developer.browse',
      },
      {
        label: 'Categories',
        icon: <FiFolder />,
        path: '/comming-soon',
        permission: 'developer.browse',
      },
      {
        label: 'Tags',
        icon: <FiTag />,
        path: '/comming-soon',
        permission: 'developer.browse',
      },
    ],
  },
  {
    label: 'Media Library',
    icon: <FiImage />,
    path: '/comming-soon',
    permission: 'developer.browse',
  },
  {
    label: 'Comments',
    icon: <FiMessageSquare />,
    path: '/comming-soon',
    permission: 'developer.browse',
  },
  {
    label: 'Pages',
    icon: <FiCopy />,
    key: 'pages',
    permission: 'developer.browse',
    children: [
      {
        label: 'All Pages',
        icon: <FiFileText />,
        path: '/comming-soon',
        permission: 'developer.browse',
      },
      {
        label: 'Create Page',
        icon: <FiFilePlus />,
        path: '/comming-soon',
        permission: 'developer.browse',
      },
    ],
  },
  {
    label: 'Website Menu',
    icon: <FiMenu />,
    path: '/comming-soon',
    permission: 'developer.browse',
  },
  {
    label: 'Reports',
    icon: <FiBarChart2 />,
    path: '/comming-soon',
    permission: 'developer.browse',
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
        label: 'Roles & Permissions',
        icon: <FiKey />,
        path: '/settings/roles',
        permission: 'role.browse',
      },
      {
        label: 'System Settings',
        icon: <FiSliders />,
        path: '/comming-soon',
        permission: 'role.browse',
      },
      {
        label: 'Activity Logs',
        icon: <FiClock />,
        path: '/comming-soon',
        permission: 'developer.browse',
      },
    ],
  },
];

const Sidebar = ({ isDesktop, isOpen, onClose }) => {
  const { user, hasPermission, logout } = useAuth();
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  // Prevent text selection (option 2 fix)
  const handleMouseDown = (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag !== 'input' && tag !== 'textarea') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const newOpen = {};
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) =>
          location.pathname.startsWith(child.path)
        );
        if (hasActiveChild && item.key) newOpen[item.key] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...newOpen }));
  }, [location.pathname]);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sidebarClass =
    'sidebar ' + (!isDesktop ? (isOpen ? 'sidebar-open' : 'sidebar-hidden') : '');

  return (
    <aside
      className={sidebarClass}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={handleMouseDown}
    >
      <div className="sidebar-header">
        <div className="logo-box">N</div>
        <div className="logo-text-wrap">
          <span className="logo-text">News Admin</span>
          <span className="logo-username">{user?.name || 'User'}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
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

          const visibleChildren = item.children.filter((child) =>
            hasPermission(child.permission)
          );
          if (visibleChildren.length === 0) return null;

          const isOpenMenu = openMenus[item.key];
          const childActive = visibleChildren.some((child) =>
            location.pathname.startsWith(child.path)
          );

          return (
            <div key={item.key} className="sidebar-group">
              <div
                className={'sidebar-link sidebar-parent' + (childActive ? ' active' : '')}
                onClick={() => toggleMenu(item.key)}
              >
                <span className="icon">{item.icon}</span>
                <span className="grow">{item.label}</span>
                <span className="chevron">
                  {isOpenMenu ? <FiChevronDown /> : <FiChevronRight />}
                </span>
              </div>

              {isOpenMenu && (
                <div className="sidebar-submenu open">
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
          <div className="avatar">{user?.name ? user.name[0].toUpperCase() : 'U'}</div>
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
