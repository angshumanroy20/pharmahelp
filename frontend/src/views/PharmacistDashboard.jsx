import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { 
  Pill, 
  FileCheck, 
  Package, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Check, 
  Truck, 
  MessageSquare,
  Search,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PharmacistDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('prescriptions');

  // Data
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search filter inside inventory
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Medicine Form State
  const [medForm, setMedForm] = useState({
    name: '',
    usage: '',
    stock: 50,
    substitutes: '',
    category: 'Analgesics & Antipyretics',
    price: 12.50,
    manufacturer: 'PharmaCare Labs',
    dosage_form: 'Tablet'
  });
  const [savingMed, setSavingMed] = useState(false);

  // Reply state
  const [replyTextMap, setReplyTextMap] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, mRes, oRes, rRes] = await Promise.all([
        api.getAllPrescriptions().catch(() => []),
        api.getMedicines().catch(() => []),
        api.getAllOrders().catch(() => []),
        api.getAllSideEffects().catch(() => []),
      ]);

      const prescs = Array.isArray(pRes) ? pRes : (pRes?.prescriptions || []);
      const meds = Array.isArray(mRes) ? mRes : (mRes?.medicines || []);
      const ords = Array.isArray(oRes) ? oRes : (oRes?.orders || []);
      const reps = Array.isArray(rRes) ? rRes : (rRes?.reports || []);

      setPrescriptions(prescs);
      setMedicines(meds);
      setOrders(ords);
      setReports(reps);
    } catch (err) {
      console.error('Pharmacist dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleVerifyPrescription = async (id) => {
    try {
      await api.verifyPrescription(id);
      confetti({ particleCount: 40, spread: 50 });
      setPrescriptions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_verified: 1 } : p))
      );
      alert(`Prescription #${id} verified successfully.`);
    } catch (err) {
      alert('Verification error: ' + err.message);
    }
  };

  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    if (!medForm.name) return;

    setSavingMed(true);
    try {
      await api.saveMedicine(medForm);
      alert('Medicine inventory updated successfully!');
      setMedForm({
        name: '',
        usage: '',
        stock: 50,
        substitutes: '',
        category: 'Analgesics & Antipyretics',
        price: 12.50,
        manufacturer: 'PharmaCare Labs',
        dosage_form: 'Tablet'
      });
      fetchData();
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setSavingMed(false);
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (!confirm('Are you sure you want to remove this medicine from inventory?')) return;
    try {
      await api.deleteMedicine(id);
      setMedicines((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  const handleReplyReport = async (reportId) => {
    const reply = replyTextMap[reportId];
    if (!reply || !reply.trim()) {
      alert('Please enter a clinical reply first');
      return;
    }

    try {
      await api.replyToSideEffect(reportId, reply);
      alert('Pharmacist reply submitted!');
      setReplyTextMap({ ...replyTextMap, [reportId]: '' });
      fetchData();
    } catch (err) {
      alert('Reply failed: ' + err.message);
    }
  };

  const filteredMedicines = medicines.filter(m => 
    (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-teal-200/80 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 font-black text-2xl flex items-center justify-center shadow-inner">
            💊
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 text-xs font-bold mb-1">
              <span>Licensed Pharmacy Operation Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Pharmacist Clinical Console</h2>
            <p className="text-xs text-slate-300">
              {user?.name || 'Registered Pharmacist'} ({user?.email || 'pharmacy@pharmahelp.care'}) • Prescription Verification & Inventory Dispatch
            </p>
          </div>
        </div>

        {/* Quick Stock Count & Refresh */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-center">
            <span className="text-[11px] text-teal-300 block font-semibold">Total SKUs</span>
            <span className="text-lg font-black text-white">{medicines.length}</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-center">
            <span className="text-[11px] text-amber-300 block font-semibold">Pending Rx</span>
            <span className="text-lg font-black text-white">
              {prescriptions.filter((p) => !p.is_verified).length}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'prescriptions', label: 'Prescription Queue', icon: FileCheck, count: prescriptions.filter((p) => !p.is_verified).length },
          { id: 'inventory', label: 'Medicine Inventory', icon: Pill, count: medicines.length },
          { id: 'orders', label: 'Orders & Dispatch', icon: Package, count: orders.length },
          { id: 'side_effects', label: 'Side Effect Reports', icon: AlertTriangle, count: reports.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isActive ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className="rounded-2xl text-xs flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* 1. PRESCRIPTIONS QUEUE */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Incoming Prescriptions Queue</h3>
            <Badge variant="secondary">{prescriptions.length} Total Prescriptions</Badge>
          </div>

          <div className="glass-card rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Rx ID</th>
                    <th className="py-3.5 px-4">Patient Name</th>
                    <th className="py-3.5 px-4">Prescribing Doctor</th>
                    <th className="py-3.5 px-4">Date Submitted</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Prescription File</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {prescriptions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-500">
                        No prescriptions uploaded yet.
                      </td>
                    </tr>
                  ) : (
                    prescriptions.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">#{p.id}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {p.patient_name || 'Patient'}
                          <span className="block text-[10px] text-slate-400">{p.patient_email}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{p.doctor || 'Physician'}</td>
                        <td className="py-3.5 px-4 text-slate-500">{new Date(p.date || p.uploaded_at || Date.now()).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4">
                          <Badge variant={p.is_verified ? 'success' : 'warning'}>
                            {p.is_verified ? 'Verified ✓' : 'Pending Verification'}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4">
                          {p.file_url ? (
                            <a
                              href={p.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-teal-600 font-bold hover:underline"
                            >
                              <span>Inspect File</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-slate-400">No file</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {!p.is_verified ? (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleVerifyPrescription(p.id)}
                              className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Verify Rx
                            </Button>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-600">Approved</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add / Edit Form */}
          <div className="lg:col-span-4">
            <Card className="border-slate-200 sticky top-28">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-600" />
                  <CardTitle className="text-base text-slate-900">Add or Update Stock</CardTitle>
                </div>
                <CardDescription className="text-xs">Update SKU inventory & pricing</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSaveMedicine} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Medicine Name</label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Paracetamol 650mg"
                      value={medForm.name}
                      onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Stock Units</label>
                      <Input
                        type="number"
                        required
                        value={medForm.stock}
                        onChange={(e) => setMedForm({ ...medForm, stock: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Unit Price ($)</label>
                      <Input
                        type="number"
                        step="0.01"
                        required
                        value={medForm.price}
                        onChange={(e) => setMedForm({ ...medForm, price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                    <select
                      value={medForm.category}
                      onChange={(e) => setMedForm({ ...medForm, category: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Analgesics & Antipyretics">Analgesics & Antipyretics</option>
                      <option value="Antibiotics">Antibiotics</option>
                      <option value="Antidiabetic">Antidiabetic</option>
                      <option value="Cardiovascular">Cardiovascular</option>
                      <option value="Gastrointestinal">Gastrointestinal</option>
                      <option value="Antihistamines">Antihistamines</option>
                      <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                      <option value="Respiratory">Respiratory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Indication / Usage</label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Fever, body pain relief"
                      value={medForm.usage}
                      onChange={(e) => setMedForm({ ...medForm, usage: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Substitute Alternatives</label>
                    <Input
                      type="text"
                      placeholder="e.g. Dolo 650, Calpol"
                      value={medForm.substitutes}
                      onChange={(e) => setMedForm({ ...medForm, substitutes: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={savingMed}
                    className="w-full mt-2"
                  >
                    {savingMed ? 'Saving...' : 'Save to Inventory'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Medicines Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-bold text-slate-900 text-lg">Active Pharmacy Inventory ({filteredMedicines.length})</h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  type="text"
                  placeholder="Filter inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <div className="glass-card rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Substitutes</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredMedicines.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">{m.name}</td>
                        <td className="py-3 px-4 text-slate-500">{m.category}</td>
                        <td className="py-3 px-4">
                          <Badge variant={m.stock < 10 ? 'destructive' : 'success'}>
                            {m.stock} units
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">${parseFloat(m.price || 0).toFixed(2)}</td>
                        <td className="py-3 px-4 text-slate-500 truncate max-w-[120px]">{m.substitutes || 'None'}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteMedicine(m.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. ORDER DISPATCH PIPELINE */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Customer Medicine Delivery Orders</h3>
            <Badge variant="secondary">{orders.length} Orders</Badge>
          </div>

          {orders.length === 0 ? (
            <Card className="py-16 text-center">
              <CardContent className="space-y-2">
                <Package className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No orders placed yet</p>
                <p className="text-xs text-slate-500">Customer medicine orders will appear here for packaging and dispatch.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((ord) => {
                const parsedItems = typeof ord.items === 'string' ? JSON.parse(ord.items || '[]') : (ord.items || []);
                return (
                  <Card key={ord.id} className="border-slate-200 shadow-xs">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Order #{ord.id}</h4>
                          <p className="text-xs text-slate-500">
                            Customer: <strong className="text-slate-800">{ord.patient_name || 'Customer'}</strong> ({ord.patient_email || 'Verified'})
                          </p>
                        </div>

                        {/* Status Dropdown */}
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="text-xs font-bold py-1 px-2.5 rounded-xl border border-slate-300 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="ready">Ready for Pickup</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Items To Package:</span>
                        {Array.isArray(parsedItems) && parsedItems.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-slate-700">
                            <span>• {it.quantity}x {it.name}</span>
                            <span className="font-semibold">${((parseFloat(it.price) || 0) * (parseInt(it.quantity) || 1)).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex justify-between items-center">
                        <span className="truncate max-w-[200px]">Address: {ord.delivery_address}</span>
                        <span className="text-sm font-black text-slate-900">${parseFloat(ord.total_amount || 0).toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. SIDE EFFECTS INQUIRIES */}
      {activeTab === 'side_effects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Reported Side Effects & Clinical Inquiries</h3>
            <Badge variant="secondary">{reports.length} Reports</Badge>
          </div>

          {reports.length === 0 ? (
            <Card className="py-16 text-center">
              <CardContent className="space-y-2">
                <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No side-effect reports</p>
                <p className="text-xs text-slate-500">Pharmacovigilance inquiries submitted by patients will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reports.map((rep) => (
                <Card key={rep.id} className="border-slate-200 shadow-xs">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          Report #{rep.id} — Patient: {rep.patient_name || 'Patient Inquiry'}
                        </h4>
                        <p className="text-[11px] text-slate-400">Date: {new Date(rep.date_reported || Date.now()).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={rep.is_verified ? 'success' : 'warning'}>
                        {rep.is_verified ? 'Physician Verified ✓' : 'Awaiting Physician'}
                      </Badge>
                    </div>

                    <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 text-xs text-amber-950">
                      <strong>Patient Symptoms:</strong> {rep.symptom}
                    </div>

                    {rep.pharmacist_reply ? (
                      <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
                        <strong>Your Response:</strong> {rep.pharmacist_reply}
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Type clinical advice or recommendation..."
                          value={replyTextMap[rep.id] || ''}
                          onChange={(e) => setReplyTextMap({ ...replyTextMap, [rep.id]: e.target.value })}
                          className="flex-1 text-xs"
                        />
                        <Button
                          onClick={() => handleReplyReport(rep.id)}
                          className="text-xs"
                        >
                          Reply
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
