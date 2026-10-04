import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Activity, 
  Pill, 
  ShieldAlert, 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  LayoutDashboard
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuth, onOpenScanner, onOpenInteractions }) => {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'doctor':
        return <Badge variant="success">🩺 Doctor</Badge>;
      case 'pharmacist':
        return <Badge variant="default">💊 Pharmacist</Badge>;
      case 'admin':
        return <Badge variant="purple">🛡️ Admin</Badge>;
      default:
        return <Badge variant="secondary">👤 Patient</Badge>;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md group-hover:bg-teal-700 transition-colors">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Pharma<span className="text-teal-600">Help</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Care
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Digital Health & Verified Pharmacy</p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'home'
                  ? 'bg-teal-50 text-teal-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('medicines')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'medicines'
                  ? 'bg-teal-50 text-teal-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Pill className="w-4 h-4 text-teal-600" />
              Medicines Catalog
            </button>

            {/* Smart Tools Buttons */}
            <button
              onClick={onOpenScanner}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Prescription Scanner
            </button>

            <button
              onClick={onOpenInteractions}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Drug Interaction Safety
            </button>

            {user && (
              <button
                onClick={() => setActiveTab('portal')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'portal'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-teal-700 hover:bg-teal-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {user.role === 'patient' && 'Patient Portal'}
                {user.role === 'pharmacist' && 'Pharmacist Desk'}
                {user.role === 'doctor' && 'Doctor Panel'}
                {user.role === 'admin' && 'Admin Hub'}
              </button>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Shopping Cart Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-xl border-slate-200"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* User Profile or Login Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setActiveTab('portal')}
                  className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition border border-slate-200/80"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">{user.name}</p>
                    {getRoleBadge(user.role)}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                onClick={onOpenAuth}
                className="gap-2 rounded-xl"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Join</span>
              </Button>
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
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
          >
            Home
          </button>
          <button
            onClick={() => { setActiveTab('medicines'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Pill className="w-4 h-4 text-teal-600" />
            Medicines Catalog
          </button>
          <button
            onClick={() => { onOpenScanner(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Prescription Scanner
          </button>
          <button
            onClick={() => { onOpenInteractions(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Drug Interaction Safety
          </button>

          {user ? (
            <button
              onClick={() => { setActiveTab('portal'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold bg-teal-600 text-white flex items-center gap-2 shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard ({user.role})
            </button>
          ) : (
            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="w-full text-center px-4 py-2.5 rounded-xl font-bold bg-teal-600 text-white shadow-xs"
            >
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
};
