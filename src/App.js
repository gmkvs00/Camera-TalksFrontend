import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserListPage from './pages/users/UserListPage';
import UserCreatePage from './pages/users/UserCreatePage';
import RoleListPage from './pages/roles/RoleListPage';
import RoleCreatePage from './pages/roles/RoleCreatePage';
import RoleEditPage from './pages/roles/RoleEditPage';
import ProtectedRoute from './components/ProtectedRoute';
import NewsListPage from './pages/news/NewsListPage';
import NewsCreatePage from "./pages/news/NewsCreatePage";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Settings -> Users */}
      <Route
        path="/settings/users"
        element={
          <ProtectedRoute>
            <UserListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/users/create"
        element={
          <ProtectedRoute>
            <UserCreatePage />
          </ProtectedRoute>
        }
      />

      {/* Settings -> Roles */}
      <Route
        path="/settings/roles"
        element={
          <ProtectedRoute>
            <RoleListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/roles/create"
        element={
          <ProtectedRoute>
            <RoleCreatePage />
          </ProtectedRoute>
        }
      />
        {/* news rout */}
      <Route path="/news" element={<ProtectedRoute><NewsListPage /></ProtectedRoute>} />
      <Route path="/news/create" element={<ProtectedRoute><NewsCreatePage /></ProtectedRoute>} />
     <Route path="/settings/roles/edit/:id" element={<RoleEditPage />} />
      {/* default */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
