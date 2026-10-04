import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Activity, 
  Pill, 
  FileText, 
  Stethoscope, 
  ShieldAlert, 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  Zap, 
  LayoutDashboard,
  Shield
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuth, onOpenScanner, onOpenInteractions }) => {
  const { user, logout, demoLogin, enterAdminMode } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const handleDemoSwitch = async (role) => {
    try {
      if (role === 'admin') {
        enterAdminMode();
        setDemoDropdownOpen(false);
        setMobileMenuOpen(false);
        setActiveTab('admin');
        return;
      }
      await demoLogin(role);
      setDemoDropdownOpen(false);
      setMobileMenuOpen(false);
      setActiveTab('portal');
    } catch (e) {
      console.warn('Switch warning:', e.message);
      setDemoDropdownOpen(false);
      setMobileMenuOpen(false);
      setActiveTab(role === 'admin' ? 'admin' : 'portal');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'doctor':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-300">🩺 Doctor</span>;
      case 'pharmacist':
        return <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-teal-300">💊 Pharmacist</span>;
      case 'admin':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-purple-300">🛡️ Admin</span>;
      default:
        return <span className="bg-sky-100 text-sky-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-sky-300">👤 Patient</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-teal group-hover:scale-105 transition-transform duration-300">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                  PharmaHelp
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                  2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Digital Health & Smart Pharmacy</p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'home'
                  ? 'bg-teal-50 text-teal-700 font-bold'
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-100/70'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('medicines')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'medicines'
                  ? 'bg-teal-50 text-teal-700 font-bold'
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-100/70'
              }`}
            >
              <Pill className="w-4 h-4 text-teal-500" />
              Medicines
            </button>

            {/* Smart Tools Buttons */}
            <button
              onClick={onOpenScanner}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Scanner
            </button>

            <button
              onClick={onOpenInteractions}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Drug Safety
            </button>

            {user && (
              <button
                onClick={() => setActiveTab('portal')}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'portal'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-teal-600 hover:bg-slate-100/70'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {user.role === 'patient' && 'Patient Portal'}
                {user.role === 'pharmacist' && 'Pharmacist Desk'}
                {user.role === 'doctor' && 'Doctor Panel'}
                {user.role === 'admin' && 'Admin Hub'}
              </button>
            )}

            {/* Dedicated Separate System Admin Access */}
            <button
              onClick={() => {
                enterAdminMode();
                setActiveTab('admin');
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 shadow-sm'
              }`}
              title="Dedicated Direct Access to System Admin Dashboard"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>System Admin</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick 1-Click Role Switcher Demo Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-300 text-amber-800 hover:bg-amber-100 transition shadow-sm"
                title="Switch roles instantly for demo testing"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span className="hidden sm:inline">Role Switcher</span>
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Instant Demo Switch:
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('patient')}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium hover:bg-teal-50 flex items-center justify-between text-slate-700"
                  >
                    <span>👤 Patient</span>
                    <span className="text-[10px] text-slate-400">Angshuman</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('doctor')}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium hover:bg-emerald-50 flex items-center justify-between text-slate-700"
                  >
                    <span>🩺 Doctor</span>
                    <span className="text-[10px] text-slate-400">Dr. Alice</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('pharmacist')}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium hover:bg-teal-50 flex items-center justify-between text-slate-700"
                  >
                    <span>💊 Pharmacist</span>
                    <span className="text-[10px] text-slate-400">Ping</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium hover:bg-purple-50 flex items-center justify-between text-slate-700"
                  >
                    <span>🛡️ System Admin</span>
                    <span className="text-[10px] text-slate-400">Pawan</span>
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-slate-700 hover:text-teal-700 hover:bg-slate-100 transition"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile or Login Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setActiveTab('portal')}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 cursor-pointer transition border border-slate-200"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">{user.name}</p>
                    {getRoleBadge(user.role)}
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-sm font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile menu burger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-teal-50"
          >
            Home
          </button>
          <button
            onClick={() => { setActiveTab('medicines'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-teal-50 flex items-center gap-2"
          >
            <Pill className="w-4 h-4 text-teal-600" />
            Medicines Catalog
          </button>
          <button
            onClick={() => { onOpenScanner(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-teal-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Prescription Scanner
          </button>
          <button
            onClick={() => { onOpenInteractions(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-teal-50 flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Drug Interaction Checker
          </button>

          <button
            onClick={() => {
              enterAdminMode();
              setActiveTab('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-bold bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-purple-700" />
            System Admin Console (Direct Access)
          </button>

          {user ? (
            <button
              onClick={() => { setActiveTab('portal'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg font-semibold bg-teal-600 text-white flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard ({user.role})
            </button>
          ) : (
            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="w-full text-center px-4 py-2.5 rounded-xl font-bold bg-teal-600 text-white"
            >
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
};
