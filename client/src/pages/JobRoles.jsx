import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobRolesAPI } from '../services/api';
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';

const JobRoles = () => {
  const { user } = useAuth();
  const [jobRoles, setJobRoles] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    type: 'technical',
    requirements: '',
    isActive: true
  });

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const fetchJobRoles = async () => {
    try {
      const response = await jobRolesAPI.getAll();
      setJobRoles(response.data.jobRoles);
    } catch (error) {
      console.error('Error fetching job roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        requirements: formData.requirements.split(',').map(r => r.trim())
      };

      if (editingRole) {
        await jobRolesAPI.update(editingRole._id, submitData);
      } else {
        await jobRolesAPI.create(submitData);
      }

      resetForm();
      fetchJobRoles();
    } catch (error) {
      console.error('Error saving job role:', error);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      title: role.title,
      description: role.description,
      department: role.department,
      type: role.type,
      requirements: role.requirements.join(', '),
      isActive: role.isActive
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job role?')) {
      try {
        await jobRolesAPI.delete(id);
        fetchJobRoles();
      } catch (error) {
        console.error('Error deleting job role:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', department: '', type: 'technical',
      requirements: '', isActive: true
    });
    setShowCreateForm(false);
    setEditingRole(null);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Roles</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Job Role</span>
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">
            {editingRole ? 'Edit Job Role' : 'Create New Job Role'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className="input-field"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="technical">Technical</option>
                  <option value="non-technical">Non-Technical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="input-field"
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements (comma separated)
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="React, Node.js, 5+ years experience"
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                required
                className="input-field"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingRole ? 'Update' : 'Create'} Job Role
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Job Roles List */}
      <div className="grid gap-4">
        {jobRoles.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No job roles found</p>
          </div>
        ) : (
          jobRoles.map(role => (
            <div key={role._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Briefcase className="h-5 w-5 text-primary-600" />
                    <h3 className="text-lg font-semibold">{role.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      role.type === 'technical' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {role.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      role.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {role.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{role.department}</p>
                  <p className="text-gray-700 mb-3">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.requirements.map((req, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
                
                {user?.role === 'admin' && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(role)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(role._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobRoles;