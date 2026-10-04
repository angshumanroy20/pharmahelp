import React from 'react';
import { Activity, PhoneCall, ShieldCheck, HeartPulse, MapPin } from 'lucide-react';

export const Footer = ({ setActiveTab, onOpenScanner, onOpenInteractions }) => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Emergency SOS Banner */}
        <div className="mb-12 p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border border-rose-900/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-white text-lg font-bold flex items-center gap-2">
                Need Immediate Medical Emergency Care?
              </h4>
              <p className="text-slate-400 text-sm">
                If you are experiencing severe chest pain, shortness of breath, or allergic shock, call emergency services immediately.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:108"
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Dial 108 / 911</span>
            </a>
            <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium">
              Poison Control: <span className="font-bold text-amber-400">1800-222-1222</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">PharmaHelp</span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Your comprehensive digital health companion for verified prescriptions, certified doctor teleconsultations, and intelligent e-pharmacy delivery.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>256-Bit Encrypted Healthcare Records</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Patient Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => setActiveTab('medicines')} className="hover:text-teal-400 transition">
                  Search & Order Medicines
                </button>
              </li>
              <li>
                <button onClick={onOpenScanner} className="hover:text-teal-400 transition">
                  AI Prescription Reader
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('portal')} className="hover:text-teal-400 transition">
                  Daily Pill Reminders
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('portal')} className="hover:text-teal-400 transition">
                  Consultation Bookings
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Clinical Tools</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={onOpenInteractions} className="hover:text-teal-400 transition">
                  Drug Interaction Diagnostic
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('portal')} className="hover:text-teal-400 transition">
                  Side Effect Pharmacovigilance
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('portal')} className="hover:text-teal-400 transition">
                  Prescription Verification Desk
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('portal')} className="hover:text-teal-400 transition">
                  Inventory Low-Stock Alerts
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Clinic & Pharmacy HQ</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>PharmaHelp Care Tower, Suite 702, Health Sciences Boulevard</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+1 (800) 555-HELP / 24x7</span>
              </p>
              <div className="pt-2">
                <span className="inline-block text-[11px] bg-slate-800 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30">
                  Licensed State Pharmacy Registry #PH-89410
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PharmaHelp Digital Health Network. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">HIPAA Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
