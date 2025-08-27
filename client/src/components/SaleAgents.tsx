import React, { useState } from 'react';
import AgentModal from './AgentModal';
import { Search, Plus, Edit, Trash2, User, Phone, Mail, Award, TrendingUp } from 'lucide-react';

const SaleAgents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agents, setAgents] = useState([

    {
      id: 'AG001',
      name: 'Ali Rahman',
      email: 'ali.rahman@example.com',
      phone: '+966 50 123 4567',
      avatar: null,
      totalBookings: 2,
      totalRevenue: 7700,
      monthlyTarget: 10000,
      joinDate: '2023-06-15',
      status: 'active',
      recentBookings: [
        { id: 'BK001', customer: 'Mohammed Ali', amount: 3500 },
        { id: 'BK004', customer: 'Aisha Omar', amount: 4200 },
      ],
    },
    {
      id: 'AG002',
      name: 'Sara Khan',
      email: 'sara.khan@example.com',
      phone: '+966 55 987 6543',
      avatar: null,
      totalBookings: 1,
      totalRevenue: 2800,
      monthlyTarget: 8000,
      joinDate: '2023-08-20',
      status: 'active',
      recentBookings: [
        { id: 'BK002', customer: 'Fatima Ahmed', amount: 2800 },
      ],
    },
    {
      id: 'AG003',
      name: 'Ahmed Malik',
      email: 'ahmed.malik@example.com',
      phone: '+966 56 555 4444',
      avatar: null,
      totalBookings: 1,
      totalRevenue: 2200,
      monthlyTarget: 6000,
      joinDate: '2023-09-10',
      status: 'active',
      recentBookings: [
        { id: 'BK003', customer: 'Ahmed Hassan', amount: 2200 },
      ],
    },
  ]);

  const handleCreateAgent = (agentData: any) => {
    const newAgent = {
      id: `AG${String(agents.length + 1).padStart(3, '0')}`,
      name: `${agentData.firstName} ${agentData.lastName}`,
      email: agentData.email,
      phone: agentData.phone,
      avatar: null,
      totalBookings: 0,
      totalRevenue: 0,
      monthlyTarget: parseInt(agentData.monthlyTarget) || 5000,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      recentBookings: [],
    };
    setAgents([...agents, newAgent]);
  };

  const getProgressPercentage = (revenue: number, target: number) => {
    return Math.min((revenue / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sale Agents</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Home</span>
            <span>/</span>
            <span className="text-blue-600">Sale Agents</span>
          </div>
        </div>
        <button 
          onClick={() => setIsAgentModalOpen(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Agent</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">{agents.length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Total Agents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">4</p>
              <p className="text-xs sm:text-sm text-gray-600">Total Bookings</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">$12,700</p>
              <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">52.9%</p>
              <p className="text-xs sm:text-sm text-gray-600">Avg. Target</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredAgents.map((agent) => {
          const progressPercentage = getProgressPercentage(agent.totalRevenue, agent.monthlyTarget);
          const progressColor = getProgressColor(progressPercentage);
          
          return (
            <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{agent.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{agent.id}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{agent.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{agent.phone}</span>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{agent.totalBookings}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">${agent.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Revenue</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className="text-gray-600">Monthly Target</span>
                  <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>${agent.totalRevenue.toLocaleString()}</span>
                  <span>${agent.monthlyTarget.toLocaleString()}</span>
                </div>
              </div>

              {/* Recent Bookings */}
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">Recent Bookings</h4>
                <div className="space-y-2">
                  {agent.recentBookings.slice(0, 2).map((booking, index) => (
                    <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 truncate flex-1 mr-2">{booking.customer}</span>
                      <span className="font-medium text-gray-900 whitespace-nowrap">${booking.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  {agent.recentBookings.length === 0 && (
                    <p className="text-xs sm:text-sm text-gray-400 italic">No recent bookings</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Modal */}
      <AgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        onSubmit={handleCreateAgent}
      />
    </div>
  );
};

export default SaleAgents;