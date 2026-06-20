import { useState } from 'react';
import { Package, Plus, Pencil, Trash2, Camera, X } from 'lucide-react';
import AdminNavbar from './admin-navbar'; // adjust path to match your folder structure

const CATEGORIES = ['All', 'Jackets', 'Shorts', 'Pants', 'Shirts', 'Tank Tops'];

const CATEGORY_COLORS = {
  Jackets: 'bg-blue-600',
  Shorts: 'bg-indigo-600',
  Pants: 'bg-slate-600',
  Shirts: 'bg-cyan-700',
  'Tank Tops': 'bg-teal-600',
};

const INITIAL_INVENTORY = [
  { id: '1', name: 'Denim Jacket', category: 'Jackets', sku: 'JCK-1001', quantity: 42, status: 'In Stock', dateAdded: 'Jun 1, 2026', initials: 'DJ', avatarColor: 'bg-blue-600', photo: null },
  { id: '2', name: 'Bomber Jacket', category: 'Jackets', sku: 'JCK-1002', quantity: 5, status: 'Low Stock', dateAdded: 'Jun 2, 2026', initials: 'BJ', avatarColor: 'bg-blue-600', photo: null },
  { id: '3', name: 'Cargo Shorts', category: 'Shorts', sku: 'SHT-2001', quantity: 8, status: 'Low Stock', dateAdded: 'Jun 3, 2026', initials: 'CS', avatarColor: 'bg-indigo-600', photo: null },
  { id: '4', name: 'Denim Shorts', category: 'Shorts', sku: 'SHT-2002', quantity: 20, status: 'In Stock', dateAdded: 'Jun 4, 2026', initials: 'DS', avatarColor: 'bg-indigo-600', photo: null },
  { id: '5', name: 'Slim Fit Pants', category: 'Pants', sku: 'PNT-3001', quantity: 0, status: 'Out of Stock', dateAdded: 'Jun 5, 2026', initials: 'SP', avatarColor: 'bg-slate-600', photo: null },
  { id: '6', name: 'Cargo Pants', category: 'Pants', sku: 'PNT-3002', quantity: 30, status: 'In Stock', dateAdded: 'Jun 6, 2026', initials: 'CP', avatarColor: 'bg-slate-600', photo: null },
  { id: '7', name: 'Polo Shirt', category: 'Shirts', sku: 'SRT-4001', quantity: 65, status: 'In Stock', dateAdded: 'Jun 7, 2026', initials: 'PS', avatarColor: 'bg-cyan-700', photo: null },
  { id: '8', name: 'Graphic Tee', category: 'Shirts', sku: 'SRT-4002', quantity: 12, status: 'Low Stock', dateAdded: 'Jun 8, 2026', initials: 'GT', avatarColor: 'bg-cyan-700', photo: null },
  { id: '9', name: 'Basic Tank Top', category: 'Tank Tops', sku: 'TNK-5001', quantity: 15, status: 'In Stock', dateAdded: 'Jun 9, 2026', initials: 'BT', avatarColor: 'bg-teal-600', photo: null },
  { id: '10', name: 'Ribbed Tank Top', category: 'Tank Tops', sku: 'TNK-5002', quantity: 3, status: 'Low Stock', dateAdded: 'Jun 10, 2026', initials: 'RT', avatarColor: 'bg-teal-600', photo: null },
];

const STATUS_STYLES = {
  'In Stock': 'text-green-400',
  'Low Stock': 'text-yellow-400',
  'Out of Stock': 'text-red-400',
};

function getStatus(quantity) {
  const qty = Number(quantity) || 0;
  if (qty === 0) return 'Out of Stock';
  if (qty <= 10) return 'Low Stock';
  return 'In Stock';
}

function getInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'NA';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function AddInventoryModal({ onClose, onSave }) {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [form, setForm] = useState({
    name: '',
    category: 'Jackets',
    sku: '',
    quantity: '',
    price: '',
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return; // require a product name
    onSave({ ...form, photoPreview });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl w-full max-w-md p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg font-semibold">Add Inventory</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <label className="block text-gray-300 text-sm mb-2">Product photo</label>
        <label
          htmlFor="product-photo"
          className="flex flex-col items-center justify-center gap-2 h-32 rounded-lg bg-gray-800 border border-dashed border-gray-600 cursor-pointer hover:bg-gray-700 transition mb-5 overflow-hidden"
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Product preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <Camera size={22} className="text-gray-400" />
              <span className="text-gray-400 text-xs">Click to take photo or upload</span>
            </>
          )}
        </label>
        <input
          id="product-photo"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoChange}
          className="hidden"
        />

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Product name</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="e.g., Denim Jacket"
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Category</label>
            <select
              value={form.category}
              onChange={handleChange('category')}
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 text-sm mb-1">SKU (optional)</label>
              <input
                type="text"
                value={form.sku}
                onChange={handleChange('sku')}
                placeholder="e.g., JCK-1003"
                className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Quantity</label>
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={handleChange('quantity')}
                placeholder="0"
                className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Price (₱, optional)</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange('price')}
              placeholder="e.g., 799"
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-gray-200 hover:bg-white text-gray-900 font-medium py-2.5 rounded-lg transition"
        >
          Save Inventory
        </button>
      </div>
    </div>
  );
}

function EditInventoryModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({
    name: item.name,
    category: item.category,
    sku: item.sku,
    quantity: item.quantity,
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return; // require a product name
    onSave(item.id, form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl w-full max-w-md p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg font-semibold">Edit Inventory</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Product name</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Category</label>
            <select
              value={form.category}
              onChange={handleChange('category')}
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 text-sm mb-1">SKU</label>
              <input
                type="text"
                value={form.sku}
                onChange={handleChange('sku')}
                className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Quantity</label>
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={handleChange('quantity')}
                className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-gray-200 hover:bg-white text-gray-900 font-medium py-2.5 rounded-lg transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default function AdminInventory() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [items, setItems] = useState(INITIAL_INVENTORY);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  const handleSaveNewItem = (form) => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newItem = {
      id: Date.now().toString(),
      name: form.name.trim(),
      category: form.category,
      sku: form.sku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      quantity: Number(form.quantity) || 0,
      status: getStatus(form.quantity),
      dateAdded: today,
      initials: getInitials(form.name),
      avatarColor: CATEGORY_COLORS[form.category] || 'bg-gray-600',
      photo: form.photoPreview,
      price: form.price ? Number(form.price) : null,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
  };

  const handleSaveEdit = (id, form) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              name: form.name.trim(),
              category: form.category,
              sku: form.sku.trim(),
              quantity: Number(form.quantity) || 0,
              status: getStatus(form.quantity),
              avatarColor: CATEGORY_COLORS[form.category] || item.avatarColor,
              initials: getInitials(form.name),
            }
          : item
      )
    );
    setEditingItem(null);
  };

  const handleDelete = (id, name) => {
    const confirmed = window.confirm(`Delete "${name}" from inventory?`);
    if (!confirmed) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-h-screen bg-gray-900 flex">
      <AdminNavbar isOpen={isNavOpen} setIsOpen={setIsNavOpen} userRole="Admin" />

      <main
        className={`flex-1 p-8 transition-all duration-300 ${
          isNavOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="bg-gray-900 rounded-xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white">
              <Package size={20} />
              <h1 className="font-semibold text-lg">
                Inventory ({filteredItems.length})
              </h1>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-gray-200 hover:bg-white text-gray-900 font-medium px-4 py-2 rounded-lg transition"
            >
              <Plus size={16} />
              Add Inventory
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-sm font-medium px-3 py-1.5 rounded-full transition ${
                  activeCategory === category
                    ? 'bg-white text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 bg-gray-800 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-9 h-9 rounded-full ${item.avatarColor} flex items-center justify-center text-white text-xs font-semibold shrink-0`}
                    >
                      {item.initials}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm">
                      {item.name}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {item.category} · {item.sku}
                    </span>
                  </div>
                </div>

                <span className="text-gray-300 text-sm w-20">
                  Qty: {item.quantity}
                </span>

                <span
                  className={`text-sm font-medium w-24 ${STATUS_STYLES[item.status]}`}
                >
                  {item.status}
                </span>

                <span className="text-gray-400 text-sm w-24">
                  {item.dateAdded}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="flex items-center gap-1 bg-gray-700 hover:bg-red-900/60 text-white text-sm font-medium px-3 py-1.5 rounded-md transition"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center text-gray-400 py-10">
                No items in this category yet. Click "Add Inventory" to create one.
              </div>
            )}
          </div>
        </div>
      </main>

      {isAddModalOpen && (
        <AddInventoryModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveNewItem}
        />
      )}

      {editingItem && (
        <EditInventoryModal
          key={editingItem.id}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}