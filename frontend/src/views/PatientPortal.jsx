import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  UploadCloud, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  ShoppingBag, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  ExternalLink,
  Trash2,
  Stethoscope,
  Activity,
  HeartPulse,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PatientPortal = ({ onOpenScanner }) => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('overview');

  // State
  const [prescriptions, setPrescriptions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [sideEffects, setSideEffects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload Prescription Form
  const [uploadDoctor, setUploadDoctor] = useState('');
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Book Appointment Form
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('10:00 AM');
  const [apptReason, setApptReason] = useState('');
  const [booking, setBooking] = useState(false);

  // Add Reminder Form
  const [remMedName, setRemMedName] = useState('');
  const [remDosage, setRemDosage] = useState('1 Tablet');
  const [remTime, setRemTime] = useState('08:00 AM');
  const [remInstructions, setRemInstructions] = useState('After breakfast');

  // Report Side Effect Form
  const [symptomText, setSymptomText] = useState('');
  const [reporting, setReporting] = useState(false);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const [pRes, rRes, aRes, sRes, oRes, dRes] = await Promise.all([
        api.getMyPrescriptions().catch(() => ({ prescriptions: [] })),
        api.getReminders().catch(() => ({ reminders: [] })),
        api.getPatientAppointments().catch(() => ({ appointments: [] })),
        api.getAllSideEffects().catch(() => ({ reports: [] })),
        api.getMyOrders().catch(() => ({ orders: [] })),
        api.getDoctors().catch(() => ({ doctors: [] })),
      ]);

      const normalize = (val, key) => {
        if (Array.isArray(val)) return val;
        if (val && Array.isArray(val[key])) return val[key];
        return [];
      };

      const normP = normalize(pRes, 'prescriptions');
      const normR = normalize(rRes, 'reminders');
      const normA = normalize(aRes, 'appointments');
      const normS = normalize(sRes, 'reports');
      const normO = normalize(oRes, 'orders');
      const normD = normalize(dRes, 'doctors');

      setPrescriptions(normP);
      setReminders(normR);
      setAppointments(normA);
      setSideEffects(normS);
      setOrders(normO);
      setDoctors(normD);
      if (normD.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(normD[0].id);
      }
    } catch (err) {
      console.error('Failed to load patient portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [user]);

  // Handlers
  const handleUploadPrescription = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please choose a prescription file (image or PDF)');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('doctor', uploadDoctor || 'Primary Care Physician');
    formData.append('date', uploadDate);
    formData.append('file', uploadFile);

    try {
      await api.uploadPrescription(formData);
      confetti({ particleCount: 50, spread: 60 });
      alert('Prescription uploaded successfully!');
      setUploadDoctor('');
      setUploadFile(null);
      fetchPatientData();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !apptDate) {
      alert('Please choose a doctor and consultation date');
      return;
    }

    setBooking(true);
    try {
      await api.bookAppointment({
        doctorId: selectedDoctorId,
        appointmentDate: apptDate,
        timeSlot: apptTime,
        reason: apptReason || 'General clinical consultation',
      });
      confetti({ particleCount: 50, spread: 60 });
      alert('Consultation booked successfully!');
      setApptReason('');
      fetchPatientData();
    } catch (err) {
      alert('Booking failed: ' + err.message);
    } finally {
      setBooking(false);
    }
  };

  const handleToggleReminder = async (id) => {
    try {
      await api.toggleReminderTaken(id);
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_taken: r.is_taken ? 0 : 1 } : r))
      );
    } catch (err) {
      alert('Failed to update reminder: ' + err.message);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!remMedName) return;

    try {
      await api.addReminder({
        medicineName: remMedName,
        dosage: remDosage,
        timeOfDay: remTime,
        instructions: remInstructions,
      });
      setRemMedName('');
      fetchPatientData();
    } catch (err) {
      alert('Failed to add reminder: ' + err.message);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await api.deleteReminder(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Failed to delete reminder: ' + err.message);
    }
  };

  const handleReportSideEffect = async (e) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    setReporting(true);
    try {
      await api.reportSideEffect(symptomText);
      alert('Side effect logged! Our clinical team has been alerted.');
      setSymptomText('');
      fetchPatientData();
    } catch (err) {
      alert('Report failed: ' + err.message);
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Patient Profile Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 bg-gradient-to-r from-teal-900 via-slate-900 to-cyan-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 font-black text-2xl flex items-center justify-center">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 text-xs font-bold mb-1">
              <span>Patient Health ID #PH-{user?.id || 101}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{user?.name}</h2>
            <p className="text-xs text-slate-300">{user?.email} • Health Profile Active</p>
          </div>
        </div>

        {/* Quick Trigger for AI Scanner */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenScanner}
            className="bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-900" />
            <span>AI Prescription Scanner</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Health Overview', icon: Activity },
          { id: 'prescriptions', label: 'My Prescriptions', icon: FileText, count: prescriptions.length },
          { id: 'reminders', label: 'Pill Alarms', icon: Clock, count: reminders.length },
          { id: 'consultations', label: 'Doctor Teleconsult', icon: Stethoscope, count: appointments.length },
          { id: 'side_effects', label: 'Side-Effect Reports', icon: AlertTriangle, count: sideEffects.length },
          { id: 'orders', label: 'Medicine Orders', icon: ShoppingBag, count: orders.length },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeSubTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold block mb-1">Prescriptions</span>
              <span className="text-2xl font-black text-slate-900">{prescriptions.length}</span>
              <span className="text-[11px] text-teal-600 font-semibold block mt-1">Verified on File</span>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold block mb-1">Daily Reminders</span>
              <span className="text-2xl font-black text-slate-900">{reminders.length}</span>
              <span className="text-[11px] text-indigo-600 font-semibold block mt-1">
                {reminders.filter((r) => r.is_taken).length} Taken Today
              </span>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold block mb-1">Consultations</span>
              <span className="text-2xl font-black text-slate-900">{appointments.length}</span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Booked Appointments</span>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold block mb-1">Medicine Orders</span>
              <span className="text-2xl font-black text-slate-900">{orders.length}</span>
              <span className="text-[11px] text-purple-600 font-semibold block mt-1">Express Deliveries</span>
            </div>
          </div>

          {/* Quick Schedule & Reminders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Today's Pills */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900 text-base">Today's Medication Adherence</h3>
                </div>
                <button
                  onClick={() => setActiveSubTab('reminders')}
                  className="text-xs text-teal-700 font-bold hover:underline"
                >
                  Manage All
                </button>
              </div>

              {reminders.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No daily reminders configured yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {reminders.slice(0, 4).map((rem) => (
                    <div
                      key={rem.id}
                      onClick={() => handleToggleReminder(rem.id)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        rem.is_taken
                          ? 'bg-teal-50/70 border-teal-200 text-teal-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          rem.is_taken ? 'bg-teal-600 text-white' : 'border border-slate-300 text-transparent'
                        }`}>
                          ✓
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${rem.is_taken ? 'line-through text-slate-400' : ''}`}>
                            {rem.medicine_name} • {rem.dosage}
                          </p>
                          <p className="text-[11px] text-slate-400">{rem.time_of_day} ({rem.instructions})</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rem.is_taken ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {rem.is_taken ? 'Taken' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Doctor Consultations */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">Upcoming Doctor Visits</h3>
                </div>
                <button
                  onClick={() => setActiveSubTab('consultations')}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  Book New
                </button>
              </div>

              {appointments.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No upcoming appointments scheduled.</p>
              ) : (
                <div className="space-y-2.5">
                  {appointments.slice(0, 3).map((appt) => (
                    <div
                      key={appt.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">Dr. {appt.doctor_name}</p>
                        <p className="text-[11px] text-slate-500">
                          {new Date(appt.appointment_date).toLocaleDateString()} at {appt.time_slot}
                        </p>
                        <p className="text-[11px] text-slate-400 italic">"{appt.reason}"</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {appt.status?.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 2. PRESCRIPTIONS */}
      {activeSubTab === 'prescriptions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Upload Form */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4 sticky top-28">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">Upload Digital Prescription</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submit an image or scanned document of your prescription for pharmacist validation and recordkeeping.
              </p>

              <form onSubmit={handleUploadPrescription} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Prescribing Doctor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Alice Grey, MD"
                    value={uploadDoctor}
                    onChange={(e) => setUploadDoctor(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Prescription Date</label>
                  <input
                    type="date"
                    required
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Prescription File (PDF, JPG, PNG)</label>
                  <input
                    type="file"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-teal-600 file:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploading ? 'Uploading...' : 'Submit Prescription'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Prescriptions List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Prescription Records ({prescriptions.length})</h3>

            {prescriptions.length === 0 ? (
              <div className="py-16 text-center glass-card rounded-3xl p-6 space-y-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-slate-600 text-sm font-semibold">No prescriptions uploaded yet</p>
                <p className="text-xs text-slate-400">Use the form on the left to securely attach your medical Rx files.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((p) => (
                  <div
                    key={p.id}
                    className="glass-card p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Doctor: {p.doctor || 'Physician'}</h4>
                        <p className="text-xs text-slate-500">
                          Date: {new Date(p.date).toLocaleDateString()} • ID #{p.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        p.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.is_verified ? 'Verified ✓' : 'Under Review'}
                      </span>

                      {p.file_url && (
                        <a
                          href={p.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                          title="View Original File"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. DAILY PILL REMINDERS */}
      {activeSubTab === 'reminders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Reminder Form */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">New Medication Alarm</h3>
              </div>

              <form onSubmit={handleAddReminder} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Medication Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paracetamol 650mg"
                    value={remMedName}
                    onChange={(e) => setRemMedName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Dosage</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1 Tablet"
                      value={remDosage}
                      onChange={(e) => setRemDosage(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Time of Day</label>
                    <input
                      type="text"
                      required
                      placeholder="08:00 AM"
                      value={remTime}
                      onChange={(e) => setRemTime(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. Take with water after breakfast"
                    value={remInstructions}
                    onChange={(e) => setRemInstructions(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Set Pill Alarm</span>
                </button>
              </form>
            </div>
          </div>

          {/* Reminders List */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-bold text-slate-900 text-lg">Active Medication Schedule</h3>
            {reminders.length === 0 ? (
              <p className="text-xs text-slate-400 py-12 text-center glass-card rounded-3xl p-6">No alarms set yet.</p>
            ) : (
              reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="glass-card p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleReminder(rem.id)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                        rem.is_taken ? 'bg-teal-600 text-white' : 'border border-slate-300 text-transparent hover:border-teal-500'
                      }`}
                    >
                      ✓
                    </button>
                    <div>
                      <p className={`text-sm font-bold ${rem.is_taken ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {rem.medicine_name} — <span className="text-indigo-600 font-semibold">{rem.dosage}</span>
                      </p>
                      <p className="text-xs text-slate-500">{rem.time_of_day} • {rem.instructions}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteReminder(rem.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* 4. DOCTOR CONSULTATIONS */}
      {activeSubTab === 'consultations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Booking Form */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Book Clinical Consultation</h3>
              </div>

              <form onSubmit={handleBookAppointment} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Select Physician</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.name} ({d.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Consultation Date</label>
                    <input
                      type="date"
                      required
                      value={apptDate}
                      onChange={(e) => setApptDate(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Time Slot</label>
                    <select
                      value={apptTime}
                      onChange={(e) => setApptTime(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="09:30 AM">09:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:30 PM">02:30 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="06:30 PM">06:30 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Primary Reason for Visit</label>
                  <textarea
                    rows="2"
                    required
                    placeholder="Describe symptoms, duration, or follow-up reason..."
                    value={apptReason}
                    onChange={(e) => setApptReason(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={booking}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
                >
                  {booking ? 'Scheduling...' : 'Confirm Appointment Slot'}
                </button>
              </form>
            </div>
          </div>

          {/* Booked Appointments List */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-bold text-slate-900 text-lg">Your Consultation Schedule</h3>
            {appointments.length === 0 ? (
              <p className="text-xs text-slate-400 py-12 text-center glass-card rounded-3xl p-6">No consultations booked.</p>
            ) : (
              appointments.map((a) => (
                <div
                  key={a.id}
                  className="glass-card p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Dr. {a.doctor_name}</h4>
                      <p className="text-xs text-slate-500">
                        {new Date(a.appointment_date).toLocaleDateString()} at {a.time_slot}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      a.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      a.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {a.status?.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong>Reason:</strong> {a.reason}
                  </p>

                  {a.clinical_notes && (
                    <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
                      <strong>Doctor's Clinical Notes:</strong> {a.clinical_notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* 5. SIDE-EFFECT PHARMACOVIGILANCE */}
      {activeSubTab === 'side_effects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Report Form */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">Report Medicine Side Effect</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Describe adverse reactions (nausea, rash, dizziness, fatigue). Your report is monitored by the clinical team.
              </p>

              <form onSubmit={handleReportSideEffect} className="space-y-3.5">
                <textarea
                  rows="4"
                  required
                  placeholder="Describe the medication taken and symptoms experienced..."
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                ></textarea>

                <button
                  type="submit"
                  disabled={reporting}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
                >
                  {reporting ? 'Submitting...' : 'Submit to Pharmacist & Doctor'}
                </button>
              </form>
            </div>
          </div>

          {/* Reports History */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-bold text-slate-900 text-lg">Reported Side Effects History</h3>
            {sideEffects.length === 0 ? (
              <p className="text-xs text-slate-400 py-12 text-center glass-card rounded-3xl p-6">No side effects reported.</p>
            ) : (
              sideEffects.map((rep) => (
                <div
                  key={rep.id}
                  className="glass-card p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Report #{rep.id} • {new Date(rep.date_reported).toLocaleDateString()}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      rep.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rep.is_verified ? 'Doctor Verified ✓' : 'Awaiting Review'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong>Reported Symptom:</strong> {rep.symptom}
                  </p>

                  {rep.pharmacist_reply && (
                    <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
                      <strong>💊 Pharmacist Advice:</strong> {rep.pharmacist_reply}
                    </div>
                  )}

                  {rep.doctor_reply && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      <strong>🩺 Doctor's Evaluation:</strong> {rep.doctor_reply}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* 6. ORDERS */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">My Medicine Orders ({orders.length})</h3>
          {orders.length === 0 ? (
            <p className="text-xs text-slate-400 py-12 text-center glass-card rounded-3xl p-6">No orders placed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="glass-card p-5 rounded-2xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Order #{ord.id}</h4>
                      <p className="text-[11px] text-slate-400">{new Date(ord.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                      ord.status === 'ready' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Ordered Items:</span>
                    {Array.isArray(ord.items) && ord.items.map((it, idx) => (
                      <p key={idx} className="text-xs text-slate-700 flex justify-between">
                        <span>{it.quantity}x {it.name}</span>
                        <span className="font-semibold">${(it.price * it.quantity).toFixed(2)}</span>
                      </p>
                    ))}
                  </div>

                  <div className="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                    <p><strong>Deliver to:</strong> {ord.delivery_address}</p>
                    <p><strong>Payment:</strong> {ord.payment_method}</p>
                    <p className="text-sm font-extrabold text-slate-900">
                      Total: <span className="text-teal-700">${parseFloat(ord.total_amount).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
