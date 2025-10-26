import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, jobRolesAPI } from '../services/api';
import { Plus, Eye, Calendar, DollarSign } from 'lucide-react';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    jobRole: '',
    resume: '',
    coverLetter: '',
    experience: '',
    skills: '',
    expectedSalary: '',
    availableFrom: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appsResponse, rolesResponse] = await Promise.all([
        applicationsAPI.getAll(),
        jobRolesAPI.getAll({ isActive: true })
      ]);
      setApplications(appsResponse.data.applications);
      setJobRoles(rolesResponse.data.jobRoles);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        experience: parseInt(formData.experience),
        expectedSalary: parseInt(formData.expectedSalary)
      };
      
      await applicationsAPI.create(submitData);
      setShowCreateForm(false);
      setFormData({
        jobRole: '', resume: '', coverLetter: '', experience: '',
        skills: '', expectedSalary: '', availableFrom: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating application:', error);
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

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Applications</h1>
        {user?.role === 'applicant' && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Application</span>
          </button>
        )}
      </div>

      {/* Create Application Form */}
      {showCreateForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Create New Application</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Role
                </label>
                <select
                  required
                  className="input-field"
                  value={formData.jobRole}
                  onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                >
                  <option value="">Select a job role</option>
                  {jobRoles.map(role => (
                    <option key={role._id} value={role._id}>
                      {role.title} - {role.department}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume URL
                </label>
                <input
                  type="url"
                  required
                  className="input-field"
                  placeholder="https://example.com/resume.pdf"
                  value={formData.resume}
                  onChange={(e) => setFormData({...formData, resume: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (years)
                </label>
                <input
                  type="number"
                  required
                  className="input-field"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Salary
                </label>
                <input
                  type="number"
                  required
                  className="input-field"
                  placeholder="80000"
                  value={formData.expectedSalary}
                  onChange={(e) => setFormData({...formData, expectedSalary: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available From
                </label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.availableFrom}
                  onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="React, Node.js, MongoDB"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter
              </label>
              <textarea
                rows={4}
                className="input-field"
                placeholder="Why are you interested in this position?"
                value={formData.coverLetter}
                onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
              />
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Applications List */}
      <div className="grid gap-4">
        {applications.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          applications.map(app => (
            <div key={app._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{app.jobRole.title}</h3>
                  <p className="text-gray-600">{app.jobRole.department}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${app.expectedSalary?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Applications;