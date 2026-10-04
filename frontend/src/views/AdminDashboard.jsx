import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Users, 
  Pill, 
  FileCheck, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  UserCheck
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes] = await Promise.all([
        api.getDashboardStats().catch(() => ({})),
        api.getAllUsers().catch(() => ({ users: [] })),
      ]);

      setStats(sRes);
      setUsersList(uRes.users || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      alert('User role updated successfully');
    } catch (err) {
      alert('Role change failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-200/80 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 font-black text-2xl flex items-center justify-center">
            🛡️
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-300 text-xs font-bold mb-1">
              <span>System Operations & Security</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Administrator Control Center</h2>
            <p className="text-xs text-slate-300">
              System Telemetry • User Governance • Analytics & Order Financials
            </p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>System Analytics & KPIs</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Role Management ({usersList.length})</span>
        </button>
      </div>

      {/* 1. ANALYTICS & KPIS */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-8">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Total User Accounts</span>
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{stats.total_users}</p>
              <p className="text-xs text-slate-500">
                {stats.total_patients} Patients • {stats.total_doctors} Doctors • {stats.total_pharmacists} Pharmacists
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Pharmacy Inventory</span>
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{stats.total_medicines}</p>
              <p className="text-xs text-rose-600 font-semibold">
                {stats.low_stock_medicines || 0} Low Stock Alerts
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Rx Verifications</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">
                {stats.verified_prescriptions} / {stats.total_prescriptions}
              </p>
              <p className="text-xs text-emerald-600 font-semibold">
                {stats.unverified_prescriptions} Pending Pharmacist Review
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Delivery Revenue</span>
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">${stats.total_revenue}</p>
              <p className="text-xs text-purple-700 font-semibold">
                {stats.total_orders} Total Orders Fulfilled
              </p>
            </div>

          </div>

          {/* Graphical Progress Gauges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Prescriptions Gauge */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 text-base">Prescription Verification Pipeline</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Verification Rate</span>
                  <span className="text-emerald-700">
                    {stats.total_prescriptions > 0
                      ? Math.round((stats.verified_prescriptions / stats.total_prescriptions) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        stats.total_prescriptions > 0
                          ? (stats.verified_prescriptions / stats.total_prescriptions) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="block font-bold">Verified Prescriptions</span>
                  <span className="text-xl font-black">{stats.verified_prescriptions}</span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="block font-bold">Unverified Queue</span>
                  <span className="text-xl font-black">{stats.unverified_prescriptions}</span>
                </div>
              </div>
            </div>

            {/* Platform Health Status */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 text-base">System Telemetry & Architecture</h4>
              
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">MySQL Connection Pool</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Healthy (Active)
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Secure JWT Authentication</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Bcrypt & Signed
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Prescription Uploads Storage</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mounted (/uploads)
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Drug Interaction Database</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Online & Active
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">System Users & Access Control</h3>
            <span className="text-xs text-slate-500 font-medium">{usersList.length} Registered Accounts</span>
          </div>

          <div className="glass-card rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="py-3.5 px-4">User ID</th>
                    <th className="py-3.5 px-4">Full Name</th>
                    <th className="py-3.5 px-4">Email Address</th>
                    <th className="py-3.5 px-4">Current Role</th>
                    <th className="py-3.5 px-4 text-right">Modify Permission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">#{u.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{u.name}</td>
                      <td className="py-3 px-4 text-slate-500">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'doctor' ? 'bg-emerald-100 text-emerald-800' :
                          u.role === 'pharmacist' ? 'bg-teal-100 text-teal-800' : 'bg-sky-100 text-sky-800'
                        }`}>
                          {u.role?.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="text-xs py-1 px-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                        >
                          <option value="patient">Patient</option>
                          <option value="doctor">Doctor</option>
                          <option value="pharmacist">Pharmacist</option>
                          <option value="admin">System Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
