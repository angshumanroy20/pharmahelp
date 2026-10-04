import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../api';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Activity, 
  Pill, 
  FileText, 
  Stethoscope, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  ShoppingCart,
  ShieldCheck,
  Clock,
  HeartPulse
} from 'lucide-react';

export const LandingPage = ({ setActiveTab, onOpenAuth, onOpenScanner, onOpenInteractions }) => {
  const { user } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();
  const [quickSearch, setQuickSearch] = useState('');
  const [featuredMeds, setFeaturedMeds] = useState([]);

  useEffect(() => {
    api.getMedicines().then(res => {
      const list = Array.isArray(res) ? res : (res?.medicines || []);
      setFeaturedMeds(list.slice(0, 6));
    }).catch(() => {});
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveTab('medicines');
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Modern Clinical Healthcare & Verified Pharmacy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Intelligent Medicine Care for a{' '}
                <span className="text-teal-600">
                  Healthier Tomorrow.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Verified prescription validation, instant AI OCR extraction, safe medication delivery, and direct doctor teleconsultations — all in one clean, easy-to-use healthcare platform.
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  onClick={() => setActiveTab('medicines')}
                  size="lg"
                  className="gap-2 shadow-sm"
                >
                  <Pill className="w-4 h-4" />
                  <span>Browse Medicines Catalog</span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={onOpenScanner}
                  className="gap-2 border-slate-200 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Prescription Scanner</span>
                </Button>
              </div>

              {/* Instant Search Bar */}
              <form onSubmit={handleSearchSubmit} className="pt-2 max-w-lg">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4" />
                  <input
                    type="text"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    placeholder="Search 35+ verified medicines, antibiotics, pain relief..."
                    className="w-full pl-12 pr-28 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white shadow-xs"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 text-xs"
                  >
                    Search
                  </Button>
                </div>
              </form>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-semibold">100% Genuine Meds</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-semibold">Licensed Pharmacists</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <HeartPulse className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-semibold">Doctor Sign-Off</span>
                </div>
              </div>

            </div>

            {/* Right Hero Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                <img
                  src="/images/hero_banner.jpg"
                  alt="PharmaHelp Smart Digital Pharmacy"
                  className="w-full h-[380px] sm:h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <Badge variant="purple" className="w-fit mb-2">
                    Verified Healthcare Hub
                  </Badge>
                  <h3 className="text-xl font-bold">Collaborative Clinical Workflow</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Physicians prescribe, pharmacists verify, and patients receive medications with zero delays.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Medicines Section (from Dataset) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="default" className="mb-2">Verified Pharmacy Catalog</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Essential Medications</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse from our clinical catalog of 35+ verified medicines with transparent pricing and real-time inventory.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setActiveTab('medicines')}
            className="self-start md:self-auto gap-2"
          >
            <span>View All 35+ Medicines</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMeds.map((med) => (
            <Card key={med.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Badge variant="secondary">{med.category}</Badge>
                  <span className="text-xs font-bold text-slate-400">{med.dosage_form}</span>
                </div>
                <CardTitle className="text-base text-slate-900">{med.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {med.usage}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-xs text-slate-600">
                  <span className="font-semibold text-slate-500 block text-[10px] uppercase">Common Substitutes:</span>
                  <p className="truncate font-medium text-slate-700">{med.substitutes || 'Standard generic'}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Unit Price</span>
                    <span className="text-lg font-black text-slate-900">${parseFloat(med.price).toFixed(2)}</span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      addToCart(med);
                      setIsCartOpen(true);
                    }}
                    className="gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Core Workflow Pillars (Replaced fake demo role switcher) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="purple" className="mb-2">Unified Healthcare System</Badge>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">How PharmaHelp Works</h2>
          <p className="text-sm text-slate-500 mt-1">
            A cohesive digital ecosystem linking patients, licensed pharmacists, and qualified physicians.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="p-6 space-y-4 border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xl border border-teal-100">
              <FileText className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. Prescription & AI Diagnostics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload prescription documents for immediate AI OCR medication extraction. Check potential drug-drug interaction contraindications instantly.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenScanner}
              className="w-full text-xs"
            >
              Try Prescription Scanner
            </Button>
          </Card>

          <Card className="p-6 space-y-4 border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl border border-emerald-100">
              <Stethoscope className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. Telehealth & Doctor Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Book consultation appointments with medical professionals, report adverse medication side effects, and receive official clinical evaluations.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenInteractions}
              className="w-full text-xs"
            >
              Check Drug Interactions
            </Button>
          </Card>

          <Card className="p-6 space-y-4 border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xl border border-purple-100">
              <Pill className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">3. Verified Pharmacy Dispensing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Registered pharmacists verify prescription dosages, regulate genuine medicine inventory, and fulfill fast home deliveries with tracking.
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => setActiveTab('medicines')}
              className="w-full text-xs"
            >
              Order from Pharmacy
            </Button>
          </Card>

        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-8 sm:p-12 bg-slate-900 text-white text-center space-y-4">
          <Badge variant="purple">Get Started Today</Badge>
          <h2 className="text-2xl sm:text-3xl font-black">Experience Next-Generation Pharmacy Care</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Create an account in seconds to manage prescriptions, set daily pill alarms, and consult qualified healthcare providers.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="default"
              size="lg"
              onClick={onOpenAuth}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
            >
              Sign In or Register
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setActiveTab('medicines')}
              className="text-white border-slate-700 hover:bg-slate-800"
            >
              Browse Medicines Catalog
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};
