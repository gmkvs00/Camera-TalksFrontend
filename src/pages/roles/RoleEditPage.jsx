// src/pages/roles/RoleEditPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import './RoleCreatePage.css'; // reuse same styles

const RoleEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateUserRole } = useAuth();

  const [form, setForm] = useState({
    name: '',
    key: '',
    permissions: [],
  });

  const [permissions, setPermissions] = useState([]);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [loadingRole, setLoadingRole] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Load all permissions
  const loadPermissions = async () => {
    setLoadingPerms(true);
    try {
      const res = await axiosClient.get('/permissions');
      setPermissions(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load permissions');
    } finally {
      setLoadingPerms(false);
    }
  };

  // Load role details
  const loadRole = async () => {
    setLoadingRole(true);
    try {
      const res = await axiosClient.get(`/rolesById/${id}`);
      const role = res.data;

      setForm({
        name: role.name || '',
        key: role.key || '',
        permissions: role.permissions || [],
      });
    } catch (err) {
      console.error('Failed to load role:', err);
      setError(err.response?.data?.message || 'Failed to load role');
    } finally {
      setLoadingRole(false);
    }
  };

  useEffect(() => {
    loadPermissions();
    loadRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Group permissions like in create page
  const groupedPermissions = permissions.reduce((acc, p) => {
    if (!acc[p.group]) acc[p.group] = [];
    acc[p.group].push(p);
    return acc;
  }, {});

  const togglePermission = (name) => {
    setForm((prev) => {
      const exists = prev.permissions.includes(name);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((n) => n !== name)
          : [...prev.permissions, name],
      };
    });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const res = await axiosClient.post(`/rolesUpdate/${id}`, form);
      const updatedRole = res.data;

      setMessage('Role updated successfully');

      // 🔥 Update logged-in user's role in context if this is their role
      updateUserRole(updatedRole);

      setTimeout(() => {
        navigate('/settings/roles');
      }, 600);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update role');
    } finally {
      setSaving(false);
    }
  };

  const isLoading = loadingPerms || loadingRole;

  return (
    <MainLayout title="Edit Role">
      <div className="card">
        <div className="list-header" style={{ marginBottom: 16 }}>
          <h2>Edit Role</h2>
          <Link to="/settings/roles" className="btn-secondary">
            Back to List
          </Link>
        </div>

        {message && <div className="alert-success">{message}</div>}
        {error && <div className="alert-error">{error}</div>}

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Role Name
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
                Role Key (unique)
                <input
                  type="text"
                  name="key"
                  value={form.key}
                  onChange={handleChange}
                  placeholder="e.g. editor, manager"
                  required
                />
              </label>
            </div>

            {/* Permissions row (same UI as create) */}
            <div className="form-row permissions-row">
              <div className="permissions-main-label">Permissions</div>

              <div className="permissions-main-field">
                {loadingPerms ? (
                  <div>Loading permissions...</div>
                ) : (
                  <div className="permissions-grid">
                    {Object.keys(groupedPermissions).map((group) => (
                      <div key={group} className="permission-group-row">
                        <div className="permission-group-title">{group}</div>

                        <div className="permission-group-items">
                          {groupedPermissions[group].map((p) => (
                            <label
                              key={p.name}
                              className="permission-item"
                              title={p.view}
                            >
                              <input
                                type="checkbox"
                                checked={form.permissions.includes(p.name)}
                                onChange={() => togglePermission(p.name)}
                              />
                              <span>{p.view}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
};

export default RoleEditPage;
