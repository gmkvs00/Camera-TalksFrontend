import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "../../components/layout/MainLayout";
import axiosClient from "../../api/axiosClient";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

const NewsListPage = () => {
  const [news, setNews] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchNews = useCallback(
    async (pageNumber = 1, pageSize = 10, searchValue = "") => {
      setLoading(true);
      try {
        const start = (pageNumber - 1) * pageSize;

        const res = await axiosClient.get("/news/datatable", {
          params: {
            draw: 1,
            start,
            length: pageSize,
            "search[value]": searchValue,
          },
        });

        setNews(res.data.data || []);
        setTotalRows(res.data.recordsFiltered ?? res.data.recordsTotal ?? 0);
      } catch (err) {
        console.error("Failed to load news:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchNews(page, perPage, search);
  }, [page, perPage, search, fetchNews]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePerRowsChange = (newPerPage, newPage) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
  };

  const columns = [
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "Category", selector: (row) => row.category || "-", sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Author",
      selector: (row) => row.author?.name || "N/A",
    },
    {
      name: "Created",
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
    },
    {
      name: "Actions",
      cell: (row) => (
        <Link
          to={`/news/edit/${row._id}`}
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

  const tableSearchBar = (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
      }}
    >
      <input
        type="text"
        placeholder="Search title or category..."
        value={search}
        onChange={handleSearchChange}
        style={{
          padding: "6px 10px",
          borderRadius: 4,
          border: "1px solid #ddd",
          minWidth: "220px",
        }}
      />
    </div>
  );

  return (
    <MainLayout title="News">
      <div className="card">
        <div className="list-header">
          <h2>News List</h2>
          <Link to="/news/create" className="btn-primary">
            Add News
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={news}
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

export default NewsListPage;
