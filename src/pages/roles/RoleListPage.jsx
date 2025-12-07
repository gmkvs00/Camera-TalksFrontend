import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import axiosClient from '../../api/axiosClient';
import DataTable from 'react-data-table-component';

const RoleListPage = () => {
  const [roles, setRoles] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);     
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const fetchRoles = async (pageNumber = page, pageSize = perPage, searchValue = search) => {
    setLoading(true);
    try {
      const start = (pageNumber - 1) * pageSize;

      const res = await axiosClient.get('/roles/datatable', {
        params: {
          draw: 1,
          start,
          length: pageSize,
          'search[value]': searchValue,
        },
      });

      setRoles(res.data.data || []);
      setTotalRows(res.data.recordsFiltered ?? res.data.recordsTotal ?? 0);
    } catch (err) {
      console.error('Failed to load roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles(1, perPage, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchRoles(newPage, perPage, search);
  };

  const handlePerRowsChange = (newPerPage, newPage) => {
    setPerPage(newPerPage);
    setPage(newPage);
    fetchRoles(newPage, newPerPage, search);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchRoles(1, perPage, value);
    setPage(1);
  };

  const columns = [
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Key', selector: row => row.key, sortable: true },
    {
      name: 'Permissions count',
      selector: row => row.permissions?.length || 0,
      sortable: false,
    },
    {
    name: 'Actions',
    cell: row => (
      <Link
        to={`/settings/roles/edit/${row._id}`}
        className="btn-sm btn-primary"
        style={{ padding: "4px 10px", borderRadius: "4px" }}
      >
        Edit
      </Link>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  ];

  // Search bar for the DataTable (separate from header)
  const tableSearchBar = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      <input
        type="text"
        placeholder="Search name or key..."
        value={search}
        onChange={handleSearchChange}
        style={{
          padding: '6px 10px',
          borderRadius: 4,
          border: '1px solid #ddd',
          minWidth: '220px',
        }}
      />
    </div>
  );

  return (
    <MainLayout title="Roles">
      <div className="card">
        {/* Header row: only title + New Role button */}
        <div className="list-header">
          <h2>Role List</h2>
          <Link to="/settings/roles/create" className="btn-primary">
            New Role
          </Link>
        </div>

        {/* DataTable area with its own search bar */}
        <DataTable
          columns={columns}
          data={roles}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={page}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
          highlightOnHover
          striped
          dense
          subHeader
          subHeaderComponent={tableSearchBar}
        />
      </div>
    </MainLayout>
  );
};

export default RoleListPage;
