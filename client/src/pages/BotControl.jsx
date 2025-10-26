import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { botAPI, applicationsAPI } from '../services/api';
import { Bot, Play, Activity, Clock, CheckCircle } from 'lucide-react';

const BotControl = () => {
  const { user } = useAuth();
  const [botActivity, setBotActivity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [activityResponse, appsResponse] = await Promise.all([
        botAPI.getActivity(),
        applicationsAPI.getAll()
      ]);
      setBotActivity(activityResponse.data.stats);
      setApplications(appsResponse.data.applications);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessUpdates = async () => {
    setProcessing(true);
    try {
      const response = await botAPI.processUpdates();
      alert(`${response.data.message}\nUpdated ${response.data.updates.length} applications`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error processing updates:', error);
      alert('Error processing updates');
    } finally {
      setProcessing(false);
    }
  };

  const handleTriggerUpdate = async (applicationId) => {
    try {
      const response = await botAPI.triggerUpdate(applicationId, {
        comment: 'Manual bot trigger'
      });
      alert('Application updated successfully');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error triggering update:', error);
      alert('Error updating application');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-purple-100 text-purple-800',
      offer: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const technicalApplications = applications.filter(app => 
    app.jobRole.type === 'technical' && 
    ['applied', 'reviewed', 'interview'].includes(app.status)
  );

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Bot className="h-8 w-8 text-primary-600" />
          <span>Bot Control Panel</span>
        </h1>
        <button
          onClick={handleProcessUpdates}
          disabled={processing}
          className="btn-primary flex items-center space-x-2"
        >
          <Play className="h-5 w-5" />
          <span>{processing ? 'Processing...' : 'Run Bot Process'}</span>
        </button>
      </div>

      {/* Bot Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Automated Actions</p>
              <p className="text-2xl font-bold text-gray-900">
                {botActivity?.totalAutomatedActions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Today's Actions</p>
              <p className="text-2xl font-bold text-gray-900">
                {botActivity?.todayActions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Processable Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {technicalApplications.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bot Activities */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Bot Activities</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {botActivity?.recentActivities?.length > 0 ? (
            botActivity.recentActivities.map((activity, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">
                    {activity.comment || 'No comment'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activities</p>
          )}
        </div>
      </div>

      {/* Technical Applications Available for Processing */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          Technical Applications Available for Processing
        </h3>
        <div className="space-y-3">
          {technicalApplications.length > 0 ? (
            technicalApplications.map(app => (
              <div key={app._id} className="flex justify-between items-center p-3 border rounded">
                <div className="flex-1">
                  <h4 className="font-medium">{app.jobRole.title}</h4>
                  <p className="text-sm text-gray-600">
                    Applicant: {app.applicant.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                  {user?.role === 'bot' && (
                    <button
                      onClick={() => handleTriggerUpdate(app._id)}
                      className="btn-secondary text-sm"
                    >
                      Trigger Update
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No technical applications available for processing
            </p>
          )}
        </div>
      </div>

      {/* Bot Information */}
      <div className="card bg-blue-50">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Bot Information</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Bot processes technical role applications automatically</p>
          <p>• Scheduled to run every 30 minutes</p>
          <p>• 70% chance of progressing each application per run</p>
          <p>• Status flow: Applied → Reviewed → Interview → Offer</p>
          <p>• Non-technical applications are ignored</p>
        </div>
      </div>
    </div>
  );
};

export default BotControl;