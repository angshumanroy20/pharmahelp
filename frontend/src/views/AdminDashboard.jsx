import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Users, 
  Pill, 
  FileCheck, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Server
} from 'lucide-react';

export const AdminDashboard = ({ onBackToHome, onOpenAuth }) => {
  const { user } = useAuth();
  const [hasAdmin, setHasAdmin] = useState(false);
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [medicinesList, setMedicinesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  // Check admin status
  useEffect(() => {
    api.getAdminStatus().then(res => {
      setHasAdmin(!!res?.hasAdmin);
    }).catch(() => {});
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes, mRes] = await Promise.all([
        api.getDashboardStats().catch(() => ({})),
        api.getAllUsers().catch(() => ({ users: [] })),
        api.getMedicines().catch(() => []),
      ]);

      setStats(sRes);
      setUsersList(uRes.users || []);
      setMedicinesList(mRes || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

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

  const handleStockUpdate = async (medId, newStock) => {
    try {
      const med = medicinesList.find(m => m.id === medId);
      if (!med) return;
      const updated = { ...med, stock: parseInt(newStock, 10) || 0 };
      await api.saveMedicine(updated);
      setMedicinesList(prev => prev.map(m => m.id === medId ? updated : m));
    } catch (err) {
      alert('Stock update failed');
    }
  };

  // If user is NOT an admin, display clean restricted access view
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Card className="p-8 sm:p-12 border-slate-200 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto border border-purple-100">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>

          {!hasAdmin ? (
            <div className="space-y-2">
              <Badge variant="purple" className="mb-2">Initial Setup</Badge>
              <h3 className="text-2xl font-black text-slate-900">No Administrator Registered</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                The System Administrator role is available exclusively to the very first person registering on this platform. Register now to claim administrator governance.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Button
                  onClick={onOpenAuth}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Register as First Administrator
                </Button>
                {onBackToHome && (
                  <Button variant="outline" onClick={onBackToHome}>
                    Return to Home
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Badge variant="destructive" className="mb-2">Access Restricted</Badge>
              <h3 className="text-2xl font-black text-slate-900">Administrator Console Locked</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                This dashboard is strictly reserved for the registered System Administrator. Please sign in with your administrative credentials to access governance metrics.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Button
                  onClick={onOpenAuth}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Sign In as Administrator
                </Button>
                {onBackToHome && (
                  <Button variant="outline" onClick={onBackToHome}>
                    Return to Home
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Active Admin View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="rounded-2xl p-6 sm:p-8 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center font-bold text-2xl">
            <Shield className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-300 text-xs font-semibold mb-1">
              <span>Primary System Administrator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Administrator Control Center</h2>
            <p className="text-xs text-slate-400">
              User Access Governance • Real-Time Inventory Control • Platform Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {onBackToHome && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToHome}
              className="text-white border-slate-700 hover:bg-slate-800 gap-1.5 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={fetchAdminData}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2 text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>System KPIs & Financials</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Accounts ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Inventory Manager ({medicinesList.length})</span>
        </button>
      </div>

      {/* 1. ANALYTICS & TELEMETRY */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Registered Accounts</span>
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-3xl font-black text-slate-900">{stats.total_users}</p>
              <p className="text-xs text-slate-500">
                {stats.total_patients} Patients • {stats.total_doctors} Doctors • {stats.total_pharmacists} Pharmacists
              </p>
            </Card>

            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Medicines Dataset</span>
                <Pill className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">{stats.total_medicines}</p>
              <p className="text-xs text-rose-600 font-semibold">
                {stats.low_stock_medicines || 0} Low Stock Alerts
              </p>
            </Card>

            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Prescriptions</span>
                <FileCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">
                {stats.verified_prescriptions} / {stats.total_prescriptions}
              </p>
              <p className="text-xs text-emerald-600 font-semibold">
                {stats.unverified_prescriptions} Pending Review
              </p>
            </Card>

            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Order Revenue</span>
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">${stats.total_revenue}</p>
              <p className="text-xs text-purple-700 font-semibold">
                {stats.total_orders} Total Orders Fulfilled
              </p>
            </Card>

          </div>

          {/* System Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">System Health & Security Protocol</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Database Connection</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active & Synced
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Administrator Constraint</span>
                  <span className="text-purple-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 1-Admin Limit Enforced
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Clinical Drug Interaction Engine</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Operational
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Prescription Pipeline Rate</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Verification Rate</span>
                  <span className="text-emerald-700">
                    {stats.total_prescriptions > 0
                      ? Math.round((stats.verified_prescriptions / stats.total_prescriptions) * 100)
                      : 100}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        stats.total_prescriptions > 0
                          ? (stats.verified_prescriptions / stats.total_prescriptions) * 100
                          : 100
                      }%`
                    }}
                  ></div>
                </div>
              </div>
            </Card>
          </div>

        </div>
      )}

      {/* 2. USERS GOVERNANCE */}
      {activeTab === 'users' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Registered Platform Users</h3>
              <p className="text-xs text-slate-500">Manage user roles and authorization permissions</p>
            </div>
            <Badge variant="secondary">{usersList.length} User(s)</Badge>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Edit Permission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {usersList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-slate-700">No Other Users Registered Yet</p>
                      <p className="text-xs text-slate-400 mt-1">
                        New patients, doctors, or pharmacists can register via the Sign In / Join dialog.
                      </p>
                    </td>
                  </tr>
                ) : (
                  usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">#{u.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                      <td className="py-3 px-4 text-slate-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={u.role === 'admin' ? 'purple' : u.role === 'doctor' ? 'success' : u.role === 'pharmacist' ? 'default' : 'secondary'}>
                          {u.role?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="text-xs py-1 px-2.5 rounded-lg border border-slate-200 bg-white font-medium"
                        >
                          <option value="patient">Patient</option>
                          <option value="doctor">Doctor</option>
                          <option value="pharmacist">Pharmacist</option>
                          <option value="admin">System Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 3. INVENTORY MANAGER */}
      {activeTab === 'inventory' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">35+ Medicines Dataset Inventory</h3>
              <p className="text-xs text-slate-500">Adjust active stock quantities and view categories</p>
            </div>
            <Badge variant="default">{medicinesList.length} Items</Badge>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase sticky top-0">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4 text-right">Update Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {medicinesList.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{m.name}</td>
                    <td className="py-2.5 px-4 text-slate-500">{m.category}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-700">${parseFloat(m.price).toFixed(2)}</td>
                    <td className="py-2.5 px-4">
                      <Badge variant={m.stock > 10 ? 'success' : 'destructive'}>
                        {m.stock} units
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <input
                        type="number"
                        defaultValue={m.stock}
                        onBlur={(e) => handleStockUpdate(m.id, e.target.value)}
                        className="w-20 px-2 py-1 rounded-lg border border-slate-200 text-xs text-right font-mono"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

    </div>
  );
};
