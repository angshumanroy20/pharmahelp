import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Pill, 
  Search, 
  ShoppingCart, 
  Check, 
  Plus, 
  Filter, 
  AlertCircle, 
  ShieldCheck, 
  ShieldAlert,
  FileCheck 
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Analgesics & Pain',
  'Antibiotics',
  'Cardiovascular & Blood Pressure',
  'Diabetes Care',
  'Gastrointestinal',
  'Respiratory & Allergy',
  'Vitamins & Supplements',
  'Dermatology & Skin',
  'Neurological & Wellness'
];

export const MedicineCatalogView = ({ onOpenInteractions }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [prescriptionFilter, setPrescriptionFilter] = useState('all'); // 'all' | 'otc' | 'rx'
  const [addedIds, setAddedIds] = useState({});

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      let res = await api.getMedicines({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
      });

      if (search.trim()) {
        res = await api.searchMedicines(search.trim());
        if (selectedCategory !== 'All') {
          res = res.filter(m => m.category === selectedCategory);
        }
      }

      if (prescriptionFilter === 'otc') {
        res = res.filter(m => !m.requires_prescription || m.requires_prescription === 0);
      } else if (prescriptionFilter === 'rx') {
        res = res.filter(m => m.requires_prescription === 1);
      }

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
    }, 200);
    return () => clearTimeout(delay);
  }, [search, selectedCategory, prescriptionFilter]);

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
            <span>Verified 35+ Medicines Dataset</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Medicine & Healthcare Catalog</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Browse genuine clinical prescription medications, generic equivalents, and OTC health essentials.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {onOpenInteractions && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenInteractions}
              className="gap-1.5 text-xs border-slate-200"
            >
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Drug Safety Check</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => setIsCartOpen(true)}
            className="gap-2 text-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>View Cart</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <Card className="p-4 sm:p-5 space-y-4 border-slate-200">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-2.5" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by brand name, active molecule, usage (e.g. Paracetamol, Cipla, Acid reflux)..."
            className="pl-10"
          />
        </div>

        {/* Prescription Type Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-500 mr-1">Filter Type:</span>
            <button
              onClick={() => setPrescriptionFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                prescriptionFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Types ({medicines.length})
            </button>
            <button
              onClick={() => setPrescriptionFilter('otc')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                prescriptionFilter === 'otc'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Over-the-Counter (OTC)
            </button>
            <button
              onClick={() => setPrescriptionFilter('rx')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                prescriptionFilter === 'rx'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Rx Required
            </button>
          </div>

          <span className="text-slate-400 font-medium">
            Showing {medicines.length} verified products
          </span>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block mr-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Grid of Medicines */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500">Retrieving medications...</p>
        </div>
      ) : medicines.length === 0 ? (
        <Card className="py-16 text-center p-8 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No matching medicines found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try searching for a generic name (e.g. Paracetamol, Omeprazole, Cetirizine) or select 'All' categories.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => {
            const inStock = (med.stock || 0) > 0;
            const isAdded = addedIds[med.id];

            return (
              <Card
                key={med.id}
                className="flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="secondary">
                      {med.category}
                    </Badge>

                    <div className="flex items-center gap-1.5">
                      {med.requires_prescription === 1 ? (
                        <Badge variant="destructive">Rx Required</Badge>
                      ) : (
                        <Badge variant="success">OTC</Badge>
                      )}

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          inStock
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {inStock ? `${med.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  {/* Title & Manufacturer */}
                  <CardTitle className="text-base leading-snug">{med.name}</CardTitle>
                  <p className="text-xs text-slate-500 font-medium">
                    {med.dosage_form || 'Tablet'} • {med.manufacturer || 'Certified Lab'}
                  </p>

                  {/* Indication / Usage */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 my-2">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Therapeutic Use:</span>
                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                      {med.usage}
                    </p>
                  </div>

                  {/* Substitutes */}
                  {med.substitutes && (
                    <div className="text-xs text-slate-500">
                      <span className="text-slate-400 text-[11px]">Substitutes: </span>
                      <span className="font-semibold text-slate-700">{med.substitutes}</span>
                    </div>
                  )}
                </CardHeader>

                {/* Bottom Pricing & Add to Cart */}
                <CardContent className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Price</span>
                    <span className="text-xl font-black text-slate-900">
                      ${parseFloat(med.price || 5.0).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(med)}
                    disabled={!inStock}
                    variant={isAdded ? 'secondary' : 'default'}
                    className="gap-1.5"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
