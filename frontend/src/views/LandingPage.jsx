import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Activity, 
  Pill, 
  FileText, 
  Stethoscope, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  HeartHandshake,
  Zap,
  ShoppingBag
} from 'lucide-react';

export const LandingPage = ({ setActiveTab, onOpenAuth, onOpenScanner, onOpenInteractions }) => {
  const { user, demoLogin } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();
  const [quickSearch, setQuickSearch] = useState('');

  const handleQuickDemo = async (role) => {
    try {
      await demoLogin(role);
      setActiveTab('portal');
    } catch (e) {
      alert('Demo switch error: ' + e.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveTab('medicines');
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Next-Gen Healthcare & AI Pharmacy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Intelligent Medicine Care for a{' '}
                <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  Healthier Tomorrow.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Seamless prescription validation, smart AI OCR extraction, express medication delivery, and direct doctor teleconsultations — all unified in one modern platform.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('medicines')}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-glow-teal hover:scale-102 transition flex items-center gap-2 text-sm"
                >
                  <Pill className="w-4 h-4" />
                  <span>Order Medicines Now</span>
                </button>

                <button
                  onClick={onOpenScanner}
                  className="glass-card hover:bg-white text-slate-800 font-bold px-5 py-3.5 rounded-2xl border border-slate-200 hover:border-teal-400 transition flex items-center gap-2 text-sm shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Scan Prescription AI</span>
                </button>
              </div>

              {/* Quick Search Widget */}
              <form onSubmit={handleSearchSubmit} className="pt-2 max-w-lg">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4" />
                  <input
                    type="text"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    placeholder="Search 1,000+ medicines (e.g. Paracetamol, Amoxicillin)..."
                    className="w-full pl-12 pr-28 py-3.5 rounded-2xl glass-card border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm font-medium"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>100% Genuine Pharmacy Stock</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Licensed Physicians & Pharmacists</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Same-Day Home Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic: Real AI Generated Art */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 group">
                <img
                  src="/images/hero_banner.jpg"
                  alt="PharmaHelp Smart Digital Pharmacy"
                  className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="inline-flex items-center gap-2 bg-teal-500/90 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full w-fit mb-2">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Real-Time Clinical Telehealth</span>
                  </div>
                  <h3 className="text-xl font-bold">Collaborative Care Protocol</h3>
                  <p className="text-xs text-slate-300">
                    Doctors review prescriptions, pharmacists verify dosages, and patients get real-time status.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1-Click Interactive Demo Role Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Try All 4 Perspectives</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore by Healthcare Role</h2>
          <p className="text-sm text-slate-500 mt-1">
            Click any role below to experience the platform with instant simulated credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Patient Card */}
          <div 
            onClick={() => handleQuickDemo('patient')}
            className="glass-card glass-card-hover p-6 rounded-3xl cursor-pointer border border-sky-100 bg-gradient-to-b from-white to-sky-50/40 relative group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xl mb-4 group-hover:scale-110 transition">
              👤
            </div>
            <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block mb-1">Patient Portal</span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Angshuman Roy</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Upload prescriptions, order medications, track daily pill alarms, and book doctor consultations.
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:translate-x-1 transition">
              <span>Launch Patient Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Doctor Card */}
          <div 
            onClick={() => handleQuickDemo('doctor')}
            className="glass-card glass-card-hover p-6 rounded-3xl cursor-pointer border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/40 relative group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl mb-4 group-hover:scale-110 transition">
              🩺
            </div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">Doctor Panel</span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dr. Alice Grey, MD</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Review appointments, conduct teleconsultations, and issue verified clinical side effect evaluations.
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition">
              <span>Launch Doctor Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pharmacist Card */}
          <div 
            onClick={() => handleQuickDemo('pharmacist')}
            className="glass-card glass-card-hover p-6 rounded-3xl cursor-pointer border border-teal-100 bg-gradient-to-b from-white to-teal-50/40 relative group"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-xl mb-4 group-hover:scale-110 transition">
              💊
            </div>
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block mb-1">Pharmacy Desk</span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ping (Lead Pharmacist)</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Approve prescription queues, adjust stock inventory, fulfill deliveries, and reply to symptom reports.
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-teal-700 group-hover:translate-x-1 transition">
              <span>Launch Pharmacy Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Admin Card */}
          <div 
            onClick={() => handleQuickDemo('admin')}
            className="glass-card glass-card-hover p-6 rounded-3xl cursor-pointer border border-purple-100 bg-gradient-to-b from-white to-purple-50/40 relative group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xl mb-4 group-hover:scale-110 transition">
              🛡️
            </div>
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">Admin Central</span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Pawan (System Admin)</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Monitor key metrics, verify system health, supervise staff permissions, and manage user accounts.
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-purple-700 group-hover:translate-x-1 transition">
              <span>Launch Admin Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* Feature Showcase Grid with Generated Media */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Full-Stack Digital Care Ecosystem</h2>
          <p className="text-sm text-slate-500 mt-1">
            Engineered with modern medical standards for patient safety and clinical convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Card 1: AI Scanner */}
          <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg flex flex-col sm:flex-row items-center">
            <div className="w-full sm:w-1/2 p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">AI Prescription Reader</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optical handwriting scanner deciphers doctor prescriptions, validates dosage frequency, and identifies safety contraindications.
              </p>
              <button
                onClick={onOpenScanner}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>Try Demo Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-full sm:w-1/2 h-56 sm:h-full relative overflow-hidden bg-slate-900">
              <img
                src="/images/scanner_art.jpg"
                alt="AI Prescription Reader"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Card 2: Telehealth */}
          <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg flex flex-col sm:flex-row items-center">
            <div className="w-full sm:w-1/2 p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Physician Teleconsultation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Schedule clinical consultations with certified doctors, discuss persistent symptoms, and receive verified digital prescriptions.
              </p>
              <button
                onClick={() => {
                  if (user) setActiveTab('portal');
                  else onOpenAuth();
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-full sm:w-1/2 h-56 sm:h-full relative overflow-hidden bg-slate-900">
              <img
                src="/images/telehealth_art.jpg"
                alt="Physician Teleconsultation"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>

        {/* 4 Supporting Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-3xl glass-card border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Drug Safety Checks</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Detect dangerous interactions and metabolic conflicts before taking multiple medications.
            </p>
            <button onClick={onOpenInteractions} className="text-xs font-bold text-rose-700 flex items-center gap-1">
              <span>Run Check</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Affordable Substitutes</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Find verified generic alternative brands with identical chemical efficacy at up to 70% lower cost.
            </p>
            <button onClick={() => setActiveTab('medicines')} className="text-xs font-bold text-teal-700 flex items-center gap-1">
              <span>Browse Catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Pill Schedule Reminders</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Personalized dosage alerts for morning, afternoon, and evening to ensure medication compliance.
            </p>
            <button onClick={() => setActiveTab('portal')} className="text-xs font-bold text-indigo-700 flex items-center gap-1">
              <span>View Reminders</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Side-Effect Reporting</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Report unexpected symptoms directly to pharmacists and doctors for clinical diagnosis and advice.
            </p>
            <button onClick={() => setActiveTab('portal')} className="text-xs font-bold text-amber-700 flex items-center gap-1">
              <span>Report Symptom</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
