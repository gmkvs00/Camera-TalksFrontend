import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const DashboardPage = () => {
  return (
    <MainLayout title="Dashboard">
      <div className="card">
        <h2>Welcome to News Admin</h2>
        <p>
          Here you’ll see quick stats like total news articles, drafts,
          published items, and more.
        </p>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
