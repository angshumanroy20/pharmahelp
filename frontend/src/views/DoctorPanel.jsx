import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
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
  UserCheck,
  Check,
  XCircle,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DoctorPanel = ({ onOpenInteractions }) => {
  const { user } = useAuth();
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
        api.getDoctorAppointments().catch(() => []),
        api.getAllSideEffects().catch(() => []),
      ]);

      const appts = Array.isArray(aRes) ? aRes : (aRes?.appointments || []);
      const effects = Array.isArray(sRes) ? sRes : (sRes?.reports || []);

      setAppointments(appts);
      setSideEffects(effects);
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
      setDoctorReplyMap({ ...doctorReplyMap, [reportId]: '' });
      fetchData();
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
  };

  const doctorName = user?.name ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) : 'Dr. Medical Practitioner, MD';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Doctor Header Banner with Generated Art */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-200/80 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <img
          src="/images/telehealth_art.jpg"
          alt="Doctor Telehealth Care"
          className="absolute right-0 top-0 h-full w-1/3 object-cover object-center opacity-25 hidden md:block"
        />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-2xl flex items-center justify-center shadow-inner">
            🩺
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold mb-1">
              <span>Physician Clinical Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{doctorName}</h2>
            <p className="text-xs text-slate-300">
              {user?.email || 'physician@pharmahelp.care'} • Certified Medical Practitioner
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Button
            variant="purple"
            size="sm"
            onClick={onOpenInteractions}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          >
            <Activity className="w-4 h-4" />
            <span>Check Drug Interactions</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <Button
          variant={activeTab === 'appointments' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('appointments')}
          className="rounded-2xl text-xs flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Patient Consultations ({appointments.length})</span>
        </Button>

        <Button
          variant={activeTab === 'side_effects' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('side_effects')}
          className="rounded-2xl text-xs flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Side-Effect Reports ({sideEffects.filter((s) => !s.is_verified).length})</span>
        </Button>
      </div>

      {/* 1. APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Scheduled Patient Consultations</h3>
            <Badge variant="secondary">{appointments.length} Consultations</Badge>
          </div>

          {appointments.length === 0 ? (
            <Card className="py-16 text-center">
              <CardContent className="space-y-2">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No scheduled consultations right now</p>
                <p className="text-xs text-slate-500">Patient tele-consultation requests will appear here in real time.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {appointments.map((a) => (
                <Card key={a.id} className="border-slate-200 shadow-xs hover:shadow-md transition">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base text-slate-900">{a.patient_name || 'Registered Patient'}</CardTitle>
                        <CardDescription className="text-xs">{a.patient_email || 'Verified User'}</CardDescription>
                      </div>
                      <Badge 
                        variant={
                          a.status === 'confirmed' ? 'success' :
                          a.status === 'completed' ? 'default' :
                          a.status === 'cancelled' ? 'destructive' : 'warning'
                        }
                      >
                        {a.status?.toUpperCase() || 'SCHEDULED'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                      <p className="text-slate-600">
                        <strong className="text-slate-800">Date & Slot:</strong> {new Date(a.appointment_date || Date.now()).toLocaleDateString()} at {a.time_slot || '10:00 AM'}
                      </p>
                      <p className="text-slate-700">
                        <strong className="text-slate-800">Reason for Visit:</strong> {a.reason || 'General medical health evaluation'}
                      </p>
                    </div>

                    {/* Clinical Notes Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Clinical Consultation Notes:
                      </label>
                      <textarea
                        rows="2"
                        placeholder="Add diagnosis, lab tests recommended, or patient advice..."
                        defaultValue={a.clinical_notes || ''}
                        onChange={(e) => setNotesMap({ ...notesMap, [a.id]: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleUpdateApptStatus(a.id, 'confirmed')}
                        className="text-xs h-8"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleUpdateApptStatus(a.id, 'completed')}
                        className="text-xs h-8"
                      >
                        Mark Completed
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateApptStatus(a.id, 'cancelled')}
                        className="text-xs h-8"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. SIDE EFFECTS CLINICAL VERIFICATIONS */}
      {activeTab === 'side_effects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Pharmacovigilance & Clinical Sign-off</h3>
            <Badge variant="secondary">{sideEffects.length} Total Reports</Badge>
          </div>

          {sideEffects.length === 0 ? (
            <Card className="py-16 text-center">
              <CardContent className="space-y-2">
                <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No side-effect reports to review</p>
                <p className="text-xs text-slate-500">Adverse drug reactions submitted by patients will be listed here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sideEffects.map((rep) => (
                <Card key={rep.id} className="border-slate-200 shadow-xs">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          Case #{rep.id} — Patient: {rep.patient_name || 'Reported Case'}
                        </h4>
                        <p className="text-[11px] text-slate-400">Date: {new Date(rep.date_reported || Date.now()).toLocaleDateString()}</p>
                      </div>

                      <Badge variant={rep.is_verified ? 'success' : 'destructive'}>
                        {rep.is_verified ? 'Verified & Signed-off ✓' : 'Requires Clinical Sign-off'}
                      </Badge>
                    </div>

                    <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 text-xs text-amber-950">
                      <strong>Patient Reported Symptom:</strong> {rep.symptom}
                    </div>

                    {rep.pharmacist_reply && (
                      <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
                        <strong>Pharmacist Initial Note:</strong> {rep.pharmacist_reply}
                      </div>
                    )}

                    {rep.doctor_reply ? (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                        <strong>Your Clinical Sign-Off:</strong> {rep.doctor_reply}
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <label className="block text-xs font-bold text-slate-600">
                          Physician Diagnosis & Guidance for Patient:
                        </label>
                        <textarea
                          rows="2"
                          placeholder="e.g. Mild allergic dermatitis suspected. Advise immediate discontinuation and switch to..."
                          value={doctorReplyMap[rep.id] || ''}
                          onChange={(e) => setDoctorReplyMap({ ...doctorReplyMap, [rep.id]: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        />
                        <Button
                          onClick={() => handleVerifySideEffect(rep.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Verify Case & Issue Clinical Advice</span>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
