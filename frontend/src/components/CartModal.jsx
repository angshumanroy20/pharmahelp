import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard, 
  MapPin, 
  CheckCircle,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CartModal = ({ onOpenAuth }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const { user } = useAuth();

  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Green Park Avenue, Sector 5');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      setIsCartOpen(false);
      onOpenAuth();
      return;
    }

    if (cartItems.length === 0) return;

    setSubmitting(true);
    try {
      const res = await api.createOrder({
        items: cartItems,
        deliveryAddress,
        paymentMethod,
        notes: 'Handle with care - verified medications.'
      });

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setOrderSuccess(res);
      clearCart();
    } catch (err) {
      alert('Order failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const displayOrderId = orderSuccess ? (orderSuccess.orderId || orderSuccess.order?.id || Math.floor(1000 + Math.random() * 9000)) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pharmacy Medicine Cart</h3>
              <p className="text-xs text-slate-500">{cartItems.length} items in basket</p>
            </div>
          </div>
          <button
            onClick={() => { setIsCartOpen(false); setOrderSuccess(null); }}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {orderSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Order Placed Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Your order <strong className="text-teal-700">#{displayOrderId}</strong> has been forwarded to the licensed pharmacist for verification and dispatch.
              </p>
              <div className="p-4 rounded-2xl bg-teal-50 text-teal-800 text-xs font-medium border border-teal-200 inline-block">
                Estimated Delivery: <strong className="text-teal-900">Within 45-60 Mins</strong>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => { setIsCartOpen(false); setOrderSuccess(null); }}
                  className="px-6 py-2.5"
                >
                  Close & Continue
                </Button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-500 font-medium text-sm">Your pharmacy cart is empty</p>
              <p className="text-xs text-slate-400">Search the medicines catalog or scan your prescription to add items.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-slate-900 text-sm truncate">{item.name}</h5>
                    <p className="text-xs text-slate-500">
                      ${item.price.toFixed(2)} • <span className="text-teal-600 font-medium">{item.category}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-1 hover:bg-slate-200 text-slate-600 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-1 hover:bg-slate-200 text-slate-600 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Delivery Details */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>Delivery Address</span>
                  </label>
                  <textarea
                    rows="2"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 resize-none"
                    placeholder="Enter full street, apartment & zip..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                    <span>Payment Mode</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Cash on Delivery')}
                      className={`p-2.5 rounded-xl border font-semibold transition ${
                        paymentMethod === 'Cash on Delivery'
                          ? 'bg-teal-50 border-teal-500 text-teal-800'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Cash on Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Prepaid Online / Card')}
                      className={`p-2.5 rounded-xl border font-semibold transition ${
                        paymentMethod === 'Prepaid Online / Card'
                          ? 'bg-teal-50 border-teal-500 text-teal-800'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Instant Card / UPI
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with totals */}
        {!orderSuccess && cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pharmacy Express Delivery</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-teal-700">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={submitting}
              className="w-full py-3 h-auto text-sm flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>{submitting ? 'Placing Order...' : user ? `Confirm & Place Order ($${cartTotal.toFixed(2)})` : 'Sign In to Complete Order'}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
