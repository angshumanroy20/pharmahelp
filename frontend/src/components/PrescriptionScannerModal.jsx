import React, { useState } from 'react';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { 
  X, 
  Sparkles, 
  UploadCloud, 
  CheckCircle2, 
  FileCheck, 
  AlertCircle, 
  ShoppingCart,
  ScanLine
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PrescriptionScannerModal = ({ isOpen, onClose }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleStartScan = async () => {
    setScanning(true);
    setProgress(15);
    setError(null);
    setScanResult(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 300);

    try {
      const res = await api.scanPrescriptionAI({ originalName: 'Prescription_DrGrey_Rx.jpg' });
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setScanning(false);
        setScanResult(res.data);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setScanning(false);
      setError('Prescription analysis error: ' + err.message);
    }
  };

  const handleAddAllToCart = () => {
    if (!scanResult?.prescribedMedicines) return;
    scanResult.prescribedMedicines.forEach((med, idx) => {
      addToCart({
        id: 100 + idx,
        name: med.name,
        price: 12.50,
        dosage_form: 'Tablet/Capsule',
        category: 'Prescription Rx'
      });
    });
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with image preview */}
        <div className="relative h-48 bg-gradient-to-r from-teal-900 via-slate-900 to-cyan-900 flex items-center p-6 overflow-hidden">
          <img 
            src="/images/scanner_art.jpg" 
            alt="AI Prescription Scanner" 
            className="absolute right-0 top-0 h-full w-1/2 object-cover object-left opacity-35 mask-radial"
          />
          <div className="relative z-10 text-white max-w-sm">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Optical AI Recognition</span>
            </div>
            <h3 className="text-2xl font-black text-white">AI Prescription Scanner</h3>
            <p className="text-slate-300 text-xs mt-1">
              Extract doctor orders, medication dosages, and contraindications directly from your prescription image.
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6">
          {!scanResult ? (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-teal-200 rounded-2xl p-8 text-center bg-teal-50/40 hover:bg-teal-50/70 transition flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 shadow-sm">
                  {scanning ? (
                    <ScanLine className="w-8 h-8 animate-bounce text-teal-600" />
                  ) : (
                    <UploadCloud className="w-8 h-8" />
                  )}
                </div>

                <h4 className="text-slate-800 font-bold text-base mb-1">
                  {scanning ? 'Analyzing Prescription Document...' : 'Upload or Test Prescription Image'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mb-4">
                  Supports JPEG, PNG, PDF formats. Our model recognizes handwriting, doctor stamps, and dosage schedules.
                </p>

                {scanning ? (
                  <div className="w-full max-w-xs space-y-2">
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] font-bold text-teal-700">{progress}% Processing OCR extraction...</p>
                  </div>
                ) : (
                  <button
                    onClick={handleStartScan}
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Run Intelligent Demo Scan</span>
                  </button>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in duration-300">
              
              {/* Scan Summary Banner */}
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-teal-600 shrink-0" />
                  <div>
                    <h5 className="font-bold text-teal-900 text-sm">Scan Completed ({scanResult.confidence} Confidence)</h5>
                    <p className="text-xs text-teal-700">{scanResult.clinicalDiagnosis}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-200/70 text-teal-800">
                  {scanResult.scanId}
                </span>
              </div>

              {/* Extracted Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Physician:</span>
                  <span className="font-bold text-slate-800">{scanResult.extractedDoctor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Patient:</span>
                  <span className="font-bold text-slate-800">{scanResult.extractedPatient}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Issue Date:</span>
                  <span className="font-bold text-slate-800">{scanResult.detectedDate}</span>
                </div>
              </div>

              {/* Prescribed Medicines List */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Recognized Medications & Dosage:
                </h5>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {scanResult.prescribedMedicines.map((med, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-slate-200 hover:border-teal-300 transition shadow-sm flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileCheck className="w-5 h-5 text-teal-600 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{med.name}</p>
                          <p className="text-xs text-slate-500">
                            {med.dosage} • <span className="font-medium text-teal-700">{med.frequency}</span> ({med.duration})
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 hidden sm:inline-block max-w-[140px] truncate text-right">
                        {med.instruction}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddAllToCart}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add All Recognized Medicines to Cart</span>
                </button>
                <button
                  onClick={() => setScanResult(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition"
                >
                  Scan Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
