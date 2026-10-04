import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { X, Lock, Mail, User, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Check admin availability whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      api.getAdminStatus().then(res => {
        setHasAdmin(!!res?.hasAdmin);
        // Default role to patient, or admin if first time and register
        if (!res?.hasAdmin && isRegister) {
          setFormData(prev => ({ ...prev, role: 'admin' }));
        }
      }).catch(() => {});
    }
  }, [isOpen, isRegister]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isRegister) {
        if (formData.role === 'admin' && hasAdmin) {
          throw new Error('System Admin has already been registered. Only the first registrant can be Admin.');
        }

        await register(formData);
        setSuccessMsg(`Account created for ${formData.name}! Signing you in...`);
        setTimeout(async () => {
          await login(formData.email, formData.password);
          onClose();
        }, 800);
      } else {
        await login(formData.email, formData.password);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {isRegister ? 'Create an Account' : 'Welcome to PharmaHelp'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isRegister
              ? 'Join PharmaHelp for verified prescriptions, orders & telehealth care'
              : 'Sign in to access your digital healthcare records'}
          </p>
        </div>

        {/* Admin Availability Notice for First-Time Setup */}
        {isRegister && !hasAdmin && (
          <div className="mb-4 p-3.5 rounded-xl bg-purple-50/90 border border-purple-200 text-purple-900 text-xs flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Initial Platform Setup</p>
              <p className="text-[11px] text-purple-700 mt-0.5">
                No administrator is currently registered. As the first registrant, you can select <strong>System Admin</strong> to manage the entire platform.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <Input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alex Morgan or Sarah Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <Input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Account Role</label>
                {!hasAdmin && (
                  <Badge variant="purple">Admin Unclaimed</Badge>
                )}
              </div>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="patient">👤 Patient (Order medicines, prescription uploads, alarms)</option>
                  <option value="doctor">🩺 Doctor (Teleconsultations, clinical notes, sign-offs)</option>
                  <option value="pharmacist">💊 Pharmacist (Inventory control, stock management, Rx checks)</option>
                  
                  {/* Admin role is available ONLY if no admin is registered yet */}
                  {!hasAdmin ? (
                    <option value="admin">🛡️ System Admin (Available to 1st registrant only)</option>
                  ) : (
                    <option value="admin" disabled>🛡️ System Admin (Claimed - Unavailable)</option>
                  )}
                </select>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {!hasAdmin 
                  ? 'System Admin role is available exclusively to the very first user registering on this platform.'
                  : 'System Admin role has already been claimed by the primary administrator.'}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl text-sm font-bold mt-2"
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
          </Button>
        </form>

        {/* Toggle Login/Register */}
        <div className="text-center mt-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => { 
              setIsRegister(!isRegister); 
              setError(null); 
              setSuccessMsg(null); 
            }}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline"
          >
            {isRegister
              ? 'Already registered? Sign In instead'
              : "Don't have an account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
};
