import React, { useState } from 'react';
import { api } from '../api';
import { 
  X, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Activity
} from 'lucide-react';

const COMMON_DRUGS = [
  'Paracetamol 650mg',
  'Ibuprofen 400mg',
  'Aspirin 75mg',
  'Tramadol 50mg',
  'Cetirizine 10mg',
  'Amoxicillin 500mg',
  'Metformin 500mg',
  'Pantoprazole DSR',
  'Atorvastatin 10mg',
  'Nemusulide'
];

export const DrugInteractionCheckerModal = ({ isOpen, onClose }) => {
  const [selectedMeds, setSelectedMeds] = useState(['Paracetamol 650mg', 'Tramadol 50mg']);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleAddMed = (name) => {
    const medName = name.trim();
    if (medName && !selectedMeds.includes(medName)) {
      setSelectedMeds([...selectedMeds, medName]);
      setInputVal('');
      setResult(null);
    }
  };

  const handleRemoveMed = (index) => {
    setSelectedMeds(selectedMeds.filter((_, idx) => idx !== index));
    setResult(null);
  };

  const handleCheck = async () => {
    if (selectedMeds.length < 2) return;
    setLoading(true);
    try {
      const res = await api.checkDrugInteractions(selectedMeds);
      setResult(res);
    } catch (err) {
      alert('Interaction check failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    if (severity === 'High Risk') {
      return (
        <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          High Risk / Contraindicated
        </span>
      );
    }
    if (severity === 'Moderate') {
      return (
        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
          <Info className="w-3 h-3 text-amber-600" />
          Moderate Caution
        </span>
      );
    }
    return (
      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Safe Co-Administration
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-amber-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Drug-Drug Interaction Checker</h3>
              <p className="text-slate-300 text-xs">Pharmacological safety analysis powered by clinical interaction database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Selected Medicine Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Medicines to Evaluate (Select 2 or more):
            </label>
            <div className="flex flex-wrap gap-2 mb-3 min-h-[42px] p-2 bg-slate-50 rounded-2xl border border-slate-200">
              {selectedMeds.length === 0 ? (
                <span className="text-xs text-slate-400 self-center px-2">No medicines selected yet. Choose from below or type.</span>
              ) : (
                selectedMeds.map((med, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-100 text-teal-800 text-xs font-bold border border-teal-300 animate-in fade-in"
                  >
                    <span>{med}</span>
                    <button
                      onClick={() => handleRemoveMed(idx)}
                      className="hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Input & Quick Suggestion tags */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMed(inputVal);
                  }
                }}
                placeholder="Type custom medication name & press Enter..."
                className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
              <button
                onClick={() => handleAddMed(inputVal)}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 font-medium">Quick Suggestions:</span>
              {COMMON_DRUGS.filter((d) => !selectedMeds.includes(d)).slice(0, 5).map((med, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddMed(med)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 border border-slate-200 transition"
                >
                  + {med}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleCheck}
            disabled={selectedMeds.length < 2 || loading}
            className="w-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-700 hover:to-amber-600 disabled:opacity-50 text-white font-bold py-3 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <Activity className="w-5 h-5 animate-spin" />
            ) : (
              <ShieldAlert className="w-5 h-5" />
            )}
            <span>Evaluate Drug Safety & Interactions</span>
          </button>

          {/* Results Display */}
          {result && (
            <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in duration-200">
              
              {/* Score header */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Safety Index Score</h4>
                  <p className="text-xs text-slate-500">{result.summary}</p>
                </div>
                <div className={`text-2xl font-black px-3 py-1 rounded-2xl ${
                  result.safetyScore >= 90 ? 'bg-emerald-100 text-emerald-800' :
                  result.safetyScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {result.safetyScore}%
                </div>
              </div>

              {/* Interactions list */}
              {result.interactions.length === 0 ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                  <p className="font-bold text-sm">No Major Contraindications Found</p>
                  <p className="text-xs text-emerald-700">
                    The chosen medications do not have known adverse competitive metabolic or toxic reactions. Always follow your prescribing doctor's exact instructions.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {result.interactions.map((inter, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">
                          {inter.drugPair.join(' ⚡ ')}
                        </span>
                        {getSeverityBadge(inter.severity)}
                      </div>
                      <p className="text-xs text-slate-600">
                        <strong className="text-slate-700">Mechanism:</strong> {inter.mechanism}
                      </p>
                      <p className="text-xs text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-100 font-medium">
                        <strong>Clinical Guidance:</strong> {inter.advice}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
