import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import axiosClient from '../../api/axiosClient';
import { Link } from 'react-router-dom';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <MainLayout title="Users">
      <div className="card">
        <div className="list-header">
          <h2>User List</h2>
          <Link to="/settings/users/create" className="btn-primary">
            New User
          </Link>
        </div>

        {error && <div className="alert-error">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3">No users found</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role?.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </MainLayout>
  );
};

export default UserListPage;
