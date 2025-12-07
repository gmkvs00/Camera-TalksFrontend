import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import axiosClient from '../../api/axiosClient';

const UserCreatePage = () => {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
  });
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadRoles = async () => {
    setLoadingRoles(true);
    setError('');
    try {
      const res = await axiosClient.get('/roles');
      setRoles(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load roles');
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      await axiosClient.post('/users', form);
      setMessage('User created successfully');
      setForm({
        name: '',
        email: '',
        password: '',
        roleId: '',
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout title="Create User">
      <div className="card">
        <form className="form-grid" onSubmit={handleSubmit}>
          {message && <div className="alert-success">{message}</div>}
          {error && <div className="alert-error">{error}</div>}

          <div className="form-row">
            <label>
              Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Role
              <select
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                required
              >
                <option value="">
                  {loadingRoles ? 'Loading roles...' : 'Select role'}
                </option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default UserCreatePage;
