import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { BarChart2, Users, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { agentsService } from '../services/agents';

interface DashboardStats {
  totalAgents: number;
  totalLists: number;
  totalItems: number;
  distributionStatus: {
    distributed: number;
    pending: number;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Get agents count
        const agents = await agentsService.getAll();
        
        setStats({
          totalAgents: agents.length,
          totalLists: 0,
          totalItems: 0,
          distributionStatus: {
            distributed: 0,
            pending: 0
          }
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: React.ElementType; color: string }) => (
    <div className={`bg-white overflow-hidden shadow-sm rounded-lg border-l-4 ${color}`}>
      <div className="p-5 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border', 'bg').replace('-500', '-100')} text-${color.split('-')[1]}-500`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Dashboard">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700">
          Welcome back, {user?.email?.split('@')[0] || 'Admin'}!
        </h2>
        <p className="text-gray-500">Here's an overview of your agent management system.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Agents"
            value={stats?.totalAgents || 0}
            icon={Users}
            color="border-blue-500"
          />
          <StatCard
            title="Total Lists"
            value={stats?.totalLists || 0}
            icon={FileSpreadsheet}
            color="border-teal-500"
          />
          <StatCard
            title="Total Items"
            value={stats?.totalItems || 0}
            icon={BarChart2}
            color="border-indigo-500"
          />
          <StatCard
            title="Pending Distribution"
            value={stats?.distributionStatus.pending || 0}
            icon={AlertCircle}
            color="border-orange-500"
          />
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="animate-pulse p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            </div>
          ) : stats?.totalLists === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm">No activity yet. Upload your first list to get started!</p>
            </div>
          ) : (
            <div className="p-6">
              <p className="text-sm text-gray-600">
                You have distributed {stats?.distributionStatus.distributed || 0} items to agents.
              </p>
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-100">
                        Distribution Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-teal-600">
                        {stats?.totalItems
                          ? Math.round((stats.distributionStatus.distributed / stats.totalItems) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-100">
                    <div
                      style={{
                        width: `${
                          stats?.totalItems
                            ? Math.round((stats.distributionStatus.distributed / stats.totalItems) * 100)
                            : 0
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500 transition-all duration-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;