import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, botAPI } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FileText, Clock, CheckCircle, XCircle, Bot, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [botActivity, setBotActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, botResponse] = await Promise.all([
        applicationsAPI.getStats(),
        user.role === 'bot' || user.role === 'admin' ? botAPI.getActivity() : Promise.resolve(null)
      ]);
      
      setStats(statsResponse.data.stats);
      if (botResponse) {
        setBotActivity(botResponse.data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statusColors = {
    applied: '#3b82f6',
    reviewed: '#f59e0b',
    interview: '#8b5cf6',
    offer: '#10b981',
    rejected: '#ef4444',
    withdrawn: '#6b7280'
  };

  const chartData = stats?.statusBreakdown ? 
    Object.entries(stats.statusBreakdown).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      color: statusColors[status]
    })) : [];

  const pieData = chartData.map(item => ({
    name: item.status,
    value: item.count,
    color: item.color
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.profile?.firstName || user?.username}!
        </h1>
        <div className="text-sm text-gray-500">
          Role: <span className="capitalize font-medium">{user?.role}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalApplications || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats?.statusBreakdown?.applied || 0) + (stats?.statusBreakdown?.reviewed || 0) + (stats?.statusBreakdown?.interview || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Offers</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.statusBreakdown?.offer || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.statusBreakdown?.rejected || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bot Activity (for bot and admin users) */}
      {(user?.role === 'bot' || user?.role === 'admin') && botActivity && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center mb-4">
              <Bot className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold">Bot Activity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Automated Actions</span>
                <span className="font-semibold">{botActivity.totalAutomatedActions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Actions</span>
                <span className="font-semibold">{botActivity.todayActions}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <Activity className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold">Recent Bot Activities</h3>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {botActivity.recentActivities?.slice(0, 5).map((activity, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-gray-600">{new Date(activity.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Application Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === 'applicant' && (
            <button 
              className="btn-primary"
              onClick={() => navigate('/applications')}
            >
              Create New Application
            </button>
          )}
          {user?.role === 'admin' && (
            <>
              <button 
                className="btn-primary"
                onClick={() => navigate('/job-roles')}
              >
                Create Job Role
              </button>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/applications')}
              >
                Manage Applications
              </button>
            </>
          )}
          {(user?.role === 'bot' || user?.role === 'admin') && (
            <button 
              className="btn-primary"
              onClick={() => navigate('/bot')}
            >
              Bot Control Panel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;