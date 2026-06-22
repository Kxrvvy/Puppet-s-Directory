import { useState, useEffect } from 'react';
import { Loader2, Banknote, CreditCard } from 'lucide-react';

const E_PAYMENT_METHODS = ['gcash', 'maya', 'qrph'];

export default function PaymentPanel({ cart, onCheckout, processing }) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEPayment = E_PAYMENT_METHODS.includes(paymentMethod);

  const cashNum = Number(cashReceived) || 0;
  const change = Math.max(0, cashNum - total);
  const insufficientCash = paymentMethod === 'cash' && cashNum > 0 && cashNum < total;

  const canCheckout =
    cart.length > 0 &&
    !processing &&
    (isEPayment || (cashNum >= total && cashNum > 0));

  useEffect(() => {
    if (isEPayment) setCashReceived('');
  }, [isEPayment]);

  useEffect(() => {
    if (cart.length === 0) setCashReceived('');
  }, [cart.length]);

  const handleCheckout = () => {
    if (!canCheckout) return;
    const tendered = isEPayment ? total : cashNum;
    onCheckout(paymentMethod, tendered);
  };

  const selectEPayment = (method) => setPaymentMethod(method);
  const selectCash = () => setPaymentMethod('cash');

  const fmt = (n) => n.toLocaleString('en-PH', { minimumFractionDigits: 2 });

  return (
    <div className="shrink-0 border-t border-slate-800 bg-slate-900">
      {/* Total */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-white font-bold text-sm">Total</span>
          <span className="text-white font-black text-xl">₱{fmt(total)}</span>
        </div>
      </div>

      {/* Cash / E-Payment top toggle */}
      <div className="px-5 pb-2">
        <div className="flex gap-2">
          <button
            onClick={selectCash}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
              paymentMethod === 'cash'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Banknote size={13} /> Cash
          </button>
          <button
            onClick={() => { if (!isEPayment) setPaymentMethod('gcash'); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
              isEPayment
                ? 'bg-slate-600 text-white'
                : 'bg-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <CreditCard size={13} /> E-Payment
          </button>
        </div>
      </div>

      {/* E-payment sub-options */}
      {isEPayment && (
        <div className="px-5 pb-3">
          <div className="flex gap-2">
            {[
              { id: 'gcash', label: 'GCash', color: 'bg-blue-600' },
              { id: 'maya', label: 'Maya', color: 'bg-green-600' },
              { id: 'qrph', label: 'QR Ph', color: 'bg-orange-500' },
            ].map(({ id, label, color }) => (
              <button
                key={id}
                onClick={() => selectEPayment(id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition ${
                  paymentMethod === id
                    ? `${color} text-white shadow-md`
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cash input */}
      {paymentMethod === 'cash' && (
        <div className="px-5 pb-3 space-y-2">
          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1.5">Cash Received</label>
            <input
              type="number"
              min="0"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              placeholder={`₱${fmt(total)}`}
              className={`w-full bg-slate-800 border text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 placeholder-slate-600 transition ${
                insufficientCash
                  ? 'border-red-500/60 focus:ring-red-500/40'
                  : 'border-slate-700 focus:ring-slate-500'
              }`}
            />
            {insufficientCash && (
              <p className="text-red-400 text-xs mt-1">Short by ₱{fmt(total - cashNum)}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold">Change</span>
            <span className={`font-black text-base ${change > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
              ₱{fmt(change)}
            </span>
          </div>
        </div>
      )}

      {/* Complete Sale button */}
      <div className="px-5 pb-5">
        <button
          onClick={handleCheckout}
          disabled={!canCheckout}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
        >
          {processing ? (
            <><Loader2 size={16} className="animate-spin" /> Processing...</>
          ) : cart.length === 0 ? (
            'Add items to start a sale'
          ) : (
            `Complete Sale  —  ₱${fmt(total)}`
          )}
        </button>
      </div>
    </div>
  );
}
