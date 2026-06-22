import { useState, useEffect } from 'react';
import { X, Loader2, Plus, Minus } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const CATEGORY_COLORS = {
  Jackets: 'bg-blue-500',
  Shorts: 'bg-indigo-500',
  Pants: 'bg-slate-500',
  Shirts: 'bg-cyan-600',
  'Tank Tops': 'bg-teal-500',
};

function getInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function VariantPickerModal({ product, onClose, onAdd }) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/product_variants/product/${product.product_id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setVariants(data))
      .catch(() => setVariants([]))
      .finally(() => setLoading(false));
  }, [product.product_id]);

  const activeVariants = variants.filter((v) => v.status === 'active');
  const maxQty = selectedVariant?.quantity_in_stock ?? 1;

  const handleSelect = (v) => {
    if (v.quantity_in_stock === 0) return;
    setSelectedVariant(v);
    setQuantity(1);
  };

  const handleAdd = () => {
    if (!selectedVariant) return;
    onAdd({
      cartId: `${selectedVariant.variant_id}-${Date.now()}`,
      product_id: product.product_id,
      item_name: product.item_name,
      variant_id: selectedVariant.variant_id,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: product.base_price,
      quantity,
      image_url: product.image_url || '',
      available_stock: selectedVariant.quantity_in_stock,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-5 border-b border-gray-100 shrink-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.item_name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <div className={`w-full h-full items-center justify-center text-white font-black text-sm ${CATEGORY_COLORS[product.category] || 'bg-gray-400'} ${product.image_url ? 'hidden' : 'flex'}`}>
              {getInitials(product.item_name)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-tight">{product.item_name}</h3>
            <p className="text-gray-400 text-sm">{product.category}</p>
            <p className="text-lg font-black text-slate-800 mt-1">
              ₱{Number(product.base_price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition shrink-0 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Variant grid */}
        <div className="p-5 flex-1 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Size &amp; Color</p>

          {loading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading variants...</span>
            </div>
          ) : activeVariants.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No variants available for this product.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {activeVariants.map((v) => {
                const outOfStock = v.quantity_in_stock === 0;
                const lowStock = !outOfStock && v.quantity_in_stock <= v.stock_threshold;
                const isSelected = selectedVariant?.variant_id === v.variant_id;

                return (
                  <button
                    key={v.variant_id}
                    onClick={() => handleSelect(v)}
                    disabled={outOfStock}
                    className={`p-3 rounded-xl border-2 text-center transition-all duration-150 ${
                      outOfStock
                        ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'border-slate-800 bg-slate-800 shadow-md scale-[1.02]'
                        : 'border-gray-200 bg-white hover:border-slate-400 hover:shadow-sm'
                    }`}
                  >
                    <span className={`block text-sm font-black ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {v.size}
                    </span>
                    <span className={`block text-xs truncate mt-0.5 ${isSelected ? 'text-slate-300' : 'text-gray-500'}`}>
                      {v.color}
                    </span>
                    <span className={`block text-xs font-bold mt-1 ${
                      outOfStock
                        ? 'text-red-400'
                        : lowStock
                        ? 'text-amber-500'
                        : isSelected
                        ? 'text-emerald-300'
                        : 'text-emerald-500'
                    }`}>
                      {outOfStock ? 'Out of stock' : `${v.quantity_in_stock} left`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quantity selector */}
          {selectedVariant && (
            <div className="mt-5 flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div>
                <span className="text-sm font-bold text-gray-700">Quantity</span>
                <p className="text-xs text-gray-400">Max: {maxQty}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition shadow-sm"
                >
                  <Minus size={14} className="text-gray-600" />
                </button>
                <span className="w-8 text-center font-black text-gray-900 text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={quantity >= maxQty}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition shadow-sm disabled:opacity-40"
                >
                  <Plus size={14} className="text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 shrink-0">
          <button
            onClick={handleAdd}
            disabled={!selectedVariant}
            className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition text-sm"
          >
            {selectedVariant
              ? `Add ${quantity}× ${selectedVariant.size} / ${selectedVariant.color}  —  ₱${(product.base_price * quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
              : 'Select a variant to continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
