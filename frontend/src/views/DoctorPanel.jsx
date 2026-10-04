import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Stethoscope, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Sparkles, 
  MessageSquare,
  Activity,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DoctorPanel = ({ onOpenInteractions }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [sideEffects, setSideEffects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Notes & reply maps
  const [doctorReplyMap, setDoctorReplyMap] = useState({});
  const [notesMap, setNotesMap] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aRes, sRes] = await Promise.all([
        api.getDoctorAppointments().catch(() => ({ appointments: [] })),
        api.getAllSideEffects().catch(() => ({ reports: [] })),
      ]);

      setAppointments(aRes.appointments || []);
      setSideEffects(sRes.reports || []);
    } catch (err) {
      console.error('Doctor fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateApptStatus = async (apptId, status) => {
    const clinicalNotes = notesMap[apptId];
    try {
      await api.updateAppointment(apptId, { status, clinicalNotes });
      setAppointments((prev) =>
        prev.map((a) => (a.id === apptId ? { ...a, status, clinical_notes: clinicalNotes || a.clinical_notes } : a))
      );
      alert(`Appointment #${apptId} updated to ${status}`);
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const handleVerifySideEffect = async (reportId) => {
    const reply = doctorReplyMap[reportId];
    if (!reply || !reply.trim()) {
      alert('Please enter your clinical diagnosis & advice');
      return;
    }

    try {
      await api.verifyAndReplyDoctor(reportId, reply);
      confetti({ particleCount: 40, spread: 50 });
      alert('Report clinically verified and sent to patient & pharmacist!');
      setDoctorReplyMap({ ...doctorReplyMap, [reportId]: '' });
      fetchData();
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Doctor Header Banner with Generated Art */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-200/80 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <img
          src="/images/telehealth_art.jpg"
          alt="Doctor Telehealth Care"
          className="absolute right-0 top-0 h-full w-1/3 object-cover object-center opacity-25 hidden md:block"
        />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-2xl flex items-center justify-center">
            🩺
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold mb-1">
              <span>Physician Clinical Panel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Dr. Alice Grey, MD</h2>
            <p className="text-xs text-slate-300">
              Department of Internal Medicine • Certified Clinical Practitioner
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={onOpenInteractions}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>Drug Interaction Diagnostic</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'appointments'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Patient Consultations ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('side_effects')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'side_effects'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Side-Effect Clinical Verifications ({sideEffects.filter((s) => !s.is_verified).length})</span>
        </button>
      </div>

      {/* 1. APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">Scheduled Patient Appointments</h3>

          {appointments.length === 0 ? (
            <div className="py-16 text-center glass-card rounded-3xl p-6 space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">No scheduled consultations right now</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {appointments.map((a) => (
                <div key={a.id} className="glass-card p-5 rounded-3xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{a.patient_name}</h4>
                      <p className="text-xs text-slate-500">{a.patient_email}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      a.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      a.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {a.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-500">
                      <strong>Date & Slot:</strong> {new Date(a.appointment_date).toLocaleDateString()} at {a.time_slot}
                    </p>
                    <p className="text-slate-700">
                      <strong>Reason for Visit:</strong> {a.reason}
                    </p>
                  </div>

                  {/* Clinical Notes Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Clinical Consultation Notes:
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Add diagnosis, lab tests recommended, or patient advice..."
                      defaultValue={a.clinical_notes || ''}
                      onChange={(e) => setNotesMap({ ...notesMap, [a.id]: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white resize-none"
                    ></textarea>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleUpdateApptStatus(a.id, 'confirmed')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                    >
                      Confirm Slot
                    </button>
                    <button
                      onClick={() => handleUpdateApptStatus(a.id, 'completed')}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => handleUpdateApptStatus(a.id, 'cancelled')}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold text-xs transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. SIDE EFFECTS CLINICAL VERIFICATIONS */}
      {activeTab === 'side_effects' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">Pharmacovigilance & Clinical Sign-off</h3>

          <div className="space-y-4">
            {sideEffects.map((rep) => (
              <div key={rep.id} className="glass-card p-5 rounded-3xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Case #{rep.id} — Patient: {rep.patient_name}
                    </h4>
                    <p className="text-[11px] text-slate-400">Date: {new Date(rep.date_reported).toLocaleDateString()}</p>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    rep.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {rep.is_verified ? 'Verified & Signed-off ✓' : 'Requires Clinical Sign-off'}
                  </span>
                </div>

                <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80 text-xs text-amber-950">
                  <strong>Patient Reported Symptom:</strong> {rep.symptom}
                </div>

                {rep.pharmacist_reply && (
                  <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
                    <strong>Pharmacist Initial Note:</strong> {rep.pharmacist_reply}
                  </div>
                )}

                {rep.doctor_reply ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <strong>Your Clinical Sign-Off:</strong> {rep.doctor_reply}
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold text-slate-600">
                      Physician Diagnosis & Guidance for Patient:
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Mild allergic dermatitis suspected. Advise immediate discontinuation of NSAID and switch to..."
                      value={doctorReplyMap[rep.id] || ''}
                      onChange={(e) => setDoctorReplyMap({ ...doctorReplyMap, [rep.id]: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    ></textarea>
                    <button
                      onClick={() => handleVerifySideEffect(rep.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Verify Case & Issue Clinical Advice</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
