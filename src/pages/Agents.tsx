import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, User, Trash2, Phone, Mail, Edit, X, Check, Search } from 'lucide-react';
import Layout from '../components/Layout';
import { agentsService, type Agent, type CreateAgentData } from '../services/agents';

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateAgentData>({
    name: '',
    email: '',
    mobile: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobile: '',
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await agentsService.getAll();
      setAgents(data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      valid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number should be 10-15 digits with optional + prefix';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await agentsService.create(formData);
      toast.success('Agent added successfully');
      setShowAddModal(false);
      setFormData({ name: '', email: '', mobile: '' });
      fetchAgents();
    } catch (error: any) {
      console.error('Failed to add agent:', error);
      toast.error(error.message || 'Failed to add agent');
    }
  };

  const handleDeleteAgent = async (id: string) => {
    try {
      await agentsService.delete(id);
      toast.success('Agent deleted successfully');
      setAgents(agents.filter(agent => agent.id !== id));
      setConfirmDelete(null);
    } catch (error: any) {
      console.error('Failed to delete agent:', error);
      toast.error(error.message || 'Failed to delete agent');
    }
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Agent Management">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Agent
        </button>
      </div>

      {loading ? (
        <div className="bg-white shadow overflow-hidden rounded-md animate-pulse">
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          </div>
        </div>
      ) : filteredAgents.length > 0 ? (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAgents.map((agent) => (
              <li key={agent.id} className="px-6 py-4 transition duration-150 ease-in-out hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                      <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {agent.email}
                        </span>
                        <span className="sm:ml-4 flex items-center mt-1 sm:mt-0">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {agent.mobile}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {confirmDelete === agent.id ? (
                      <>
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="mr-2 p-1 rounded-full text-red-600 hover:text-red-800"
                          title="Confirm"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="p-1 rounded-full text-gray-600 hover:text-gray-800"
                          title="Cancel"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(agent.id)}
                        className="p-1 rounded-full text-gray-600 hover:text-red-600 transition-colors duration-200"
                        title="Delete agent"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md p-6 text-center">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No agents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "No agents match your search criteria."
              : "Get started by adding a new agent."}
          </p>
        </div>
      )}

      {/* Add Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Add New Agent</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddAgent} className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                    Mobile Number (with country code)
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.mobile ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="+1234567890"
                  />
                  {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Agents;