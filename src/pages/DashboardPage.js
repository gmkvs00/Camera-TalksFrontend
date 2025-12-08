import "./DashboardPage.css";

import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const trafficData = [
  { day: 'Mon', views: 12000, reads: 8200 },
  { day: 'Tue', views: 15800, reads: 10400 },
  { day: 'Wed', views: 9800, reads: 7200 },
  { day: 'Thu', views: 18200, reads: 13100 },
  { day: 'Fri', views: 14300, reads: 10200 },
  { day: 'Sat', views: 7600, reads: 5200 },
  { day: 'Sun', views: 16700, reads: 11900 },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const displayName = user?.name || 'Admin';

  return (
    <div className="page-transition">
    <MainLayout title="Dashboard">
      <div className="dashboard">
        {/* Top Welcome + Subtext */}
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-title">Welcome back, {displayName} 👋</h2>
            <p className="dashboard-subtitle">
              Here’s a quick overview of what’s happening on your news platform today.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-grid">
          <div className="card stat-card">
            <div className="stat-label">Total Articles</div>
            <div className="stat-value">1,248</div>
            <div className="stat-trend positive">+32 this week</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Drafts</div>
            <div className="stat-value">18</div>
            <div className="stat-trend neutral">Stable this week</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Published Today</div>
            <div className="stat-value">12</div>
            <div className="stat-trend positive">+4 vs yesterday</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Total Views</div>
            <div className="stat-value">89,420</div>
            <div className="stat-trend positive">+8.2% this week</div>
          </div>
        </div>

        {/* Real Chart with Recharts */}
        <div className="card dashboard-chart">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Traffic & Reads (Last 7 Days)</h3>
              <p className="chart-subtitle">
                Dummy analytics data, similar to real news dashboards. We’ll wire this to real
                analytics later.
              </p>
            </div>
          </div>

          <div className="chart-body real-chart">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trafficData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  name="Views"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="reads"
                  name="Reads"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </MainLayout>
    </div>
  );
};

export default DashboardPage;

