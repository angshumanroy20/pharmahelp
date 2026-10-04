import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './views/LandingPage';
import { MedicineCatalogView } from './views/MedicineCatalogView';
import { PatientPortal } from './views/PatientPortal';
import { PharmacistDashboard } from './views/PharmacistDashboard';
import { DoctorPanel } from './views/DoctorPanel';
import { AdminDashboard } from './views/AdminDashboard';
import { PrescriptionScannerModal } from './components/PrescriptionScannerModal';
import { DrugInteractionCheckerModal } from './components/DrugInteractionCheckerModal';
import { CartModal } from './components/CartModal';
import { AuthModal } from './components/AuthModal';

export const App = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isInteractionsOpen, setIsInteractionsOpen] = useState(false);

  const renderActiveView = () => {
    if (activeTab === 'medicines') {
      return (
        <MedicineCatalogView 
          onOpenInteractions={() => setIsInteractionsOpen(true)} 
        />
      );
    }

    if (activeTab === 'portal') {
      if (!user) {
        return (
          <div className="max-w-md mx-auto my-20 p-8 glass-card rounded-3xl text-center space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Sign In Required</h3>
            <p className="text-xs text-slate-500">
              Please sign in or use a 1-click demo account to access your role-specific healthcare dashboard.
            </p>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition"
            >
              Open Sign In
            </button>
          </div>
        );
      }

      switch (user.role) {
        case 'doctor':
          return (
            <DoctorPanel 
              onOpenInteractions={() => setIsInteractionsOpen(true)} 
            />
          );
        case 'pharmacist':
          return <PharmacistDashboard />;
        case 'admin':
          return <AdminDashboard />;
        default:
          return (
            <PatientPortal 
              onOpenScanner={() => setIsScannerOpen(true)} 
            />
          );
      }
    }

    // Default Home / Landing View
    return (
      <LandingPage
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenInteractions={() => setIsInteractionsOpen(true)}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenInteractions={() => setIsInteractionsOpen(true)}
      />

      {/* Main Dynamic View */}
      <main className="flex-1 w-full">
        {renderActiveView()}
      </main>

      {/* Interactive Global Modals */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      <PrescriptionScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
      />

      <DrugInteractionCheckerModal 
        isOpen={isInteractionsOpen} 
        onClose={() => setIsInteractionsOpen(false)} 
      />

      <CartModal 
        onOpenAuth={() => setIsAuthOpen(true)} 
      />

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenInteractions={() => setIsInteractionsOpen(true)}
      />
    </div>
  );
};
