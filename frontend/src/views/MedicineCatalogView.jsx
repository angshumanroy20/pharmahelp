import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { 
  Pill, 
  Search, 
  ShoppingCart, 
  Check, 
  Plus, 
  Filter, 
  AlertCircle, 
  ShieldCheck, 
  FileCheck 
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Analgesics & Antipyretics',
  'Antibiotics',
  'Antidiabetic',
  'Cardiovascular',
  'Gastrointestinal',
  'Antihistamines',
  'Vitamins & Supplements'
];

export const MedicineCatalogView = ({ onOpenInteractions }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedIds, setAddedIds] = useState({});

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await api.getMedicines({
        search: search || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
      });
      setMedicines(res);
    } catch (err) {
      console.error('Error fetching medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMedicines();
    }, 250);
    return () => clearTimeout(delay);
  }, [search, selectedCategory]);

  const handleAddToCart = (med) => {
    addToCart(med, 1);
    setAddedIds((prev) => ({ ...prev, [med.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [med.id]: false }));
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
            <Pill className="w-3.5 h-3.5 text-teal-600" />
            <span>Certified Pharmacy Inventory</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Medicine & Healthcare Catalog</h2>
          <p className="text-slate-500 text-sm mt-1">
            Browse genuine prescription drugs, generic alternatives, and OTC health essentials.
          </p>
        </div>

        {/* View Cart Pill */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 self-start md:self-auto"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Open Cart</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 sm:p-5 rounded-3xl border border-slate-200/80 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by brand name, active molecule, or symptom usage (e.g., Fever, Cipla)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Medicines */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">Loading verified inventory...</p>
        </div>
      ) : medicines.length === 0 ? (
        <div className="py-20 text-center glass-card rounded-3xl p-8 space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h4 className="text-lg font-bold text-slate-800">No matching medicines found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or selecting another category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => {
            const inStock = (med.stock || 0) > 0;
            const isAdded = addedIds[med.id];

            return (
              <div
                key={med.id}
                className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {med.category || 'General Care'}
                    </span>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        inStock
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {inStock ? `${med.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  {/* Title & Dosage */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{med.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    {med.dosage_form || 'Tablet'} • {med.manufacturer || 'PharmaCore Labs'}
                  </p>

                  {/* Usage */}
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 mb-3">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Indication:</span>
                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                      {med.usage || 'Prescription medication for targeted therapeutic relief.'}
                    </p>
                  </div>

                  {/* Substitutes */}
                  {med.substitutes && med.substitutes !== 'None' && (
                    <div className="text-xs text-slate-500">
                      <span className="text-slate-400 font-medium">Alternative brands: </span>
                      <span className="font-semibold text-slate-700">{med.substitutes}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Pricing & Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Unit Price</span>
                    <span className="text-xl font-black text-slate-900">
                      ${parseFloat(med.price || 12.5).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(med)}
                    disabled={!inStock}
                    className={`px-4 py-2.5 rounded-2xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : inStock
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
