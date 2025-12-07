import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import axiosClient from '../../api/axiosClient';
import './RoleCreatePage.css';

const RoleCreatePage = () => {
  const [form, setForm] = useState({
    name: '',
    key: '',
    permissions: [],
  });

  const [permissions, setPermissions] = useState([]);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadPermissions = async () => {
    setLoadingPerms(true);
    setError('');
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

  useEffect(() => {
    loadPermissions();
  }, []);

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
      await axiosClient.post('/roles', form);
      setMessage('Role created successfully');
      setForm({
        name: '',
        key: '',
        permissions: [],
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create role');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout title="Create Role">
      <div className="card">
        <form className="form-grid" onSubmit={handleSubmit}>
          {message && <div className="alert-success">{message}</div>}
          {error && <div className="alert-error">{error}</div>}

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

          {/* Permissions row */}
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
              {saving ? 'Saving...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default RoleCreatePage;
