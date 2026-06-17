import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Pencil, Trash2 } from 'lucide-react';
import AdminNavbar from './admin-navbar'; // adjust path to match your folder structure

const CATEGORIES = ['All', 'Jackets', 'Shorts', 'Pants', 'Shirts', 'Tank Tops'];

const INITIAL_INVENTORY = [
  {
    id: '1',
    name: 'Denim Jacket',
    category: 'Jackets',
    sku: 'JCK-1001',
    quantity: 42,
    status: 'In Stock',
    dateAdded: 'Jun 1, 2026',
    initials: 'DJ',
    avatarColor: 'bg-blue-600',
  },
  {
    id: '2',
    name: 'Bomber Jacket',
    category: 'Jackets',
    sku: 'JCK-1002',
    quantity: 5,
    status: 'Low Stock',
    dateAdded: 'Jun 2, 2026',
    initials: 'BJ',
    avatarColor: 'bg-blue-600',
  },
  {
    id: '3',
    name: 'Cargo Shorts',
    category: 'Shorts',
    sku: 'SHT-2001',
    quantity: 8,
    status: 'Low Stock',
    dateAdded: 'Jun 3, 2026',
    initials: 'CS',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: '4',
    name: 'Denim Shorts',
    category: 'Shorts',
    sku: 'SHT-2002',
    quantity: 20,
    status: 'In Stock',
    dateAdded: 'Jun 4, 2026',
    initials: 'DS',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: '5',
    name: 'Slim Fit Pants',
    category: 'Pants',
    sku: 'PNT-3001',
    quantity: 0,
    status: 'Out of Stock',
    dateAdded: 'Jun 5, 2026',
    initials: 'SP',
    avatarColor: 'bg-slate-600',
  },
  {
    id: '6',
    name: 'Cargo Pants',
    category: 'Pants',
    sku: 'PNT-3002',
    quantity: 30,
    status: 'In Stock',
    dateAdded: 'Jun 6, 2026',
    initials: 'CP',
    avatarColor: 'bg-slate-600',
  },
  {
    id: '7',
    name: 'Polo Shirt',
    category: 'Shirts',
    sku: 'SRT-4001',
    quantity: 65,
    status: 'In Stock',
    dateAdded: 'Jun 7, 2026',
    initials: 'PS',
    avatarColor: 'bg-cyan-700',
  },
  {
    id: '8',
    name: 'Graphic Tee',
    category: 'Shirts',
    sku: 'SRT-4002',
    quantity: 12,
    status: 'Low Stock',
    dateAdded: 'Jun 8, 2026',
    initials: 'GT',
    avatarColor: 'bg-cyan-700',
  },
  {
    id: '9',
    name: 'Basic Tank Top',
    category: 'Tank Tops',
    sku: 'TNK-5001',
    quantity: 15,
    status: 'In Stock',
    dateAdded: 'Jun 9, 2026',
    initials: 'BT',
    avatarColor: 'bg-teal-600',
  },
  {
    id: '10',
    name: 'Ribbed Tank Top',
    category: 'Tank Tops',
    sku: 'TNK-5002',
    quantity: 3,
    status: 'Low Stock',
    dateAdded: 'Jun 10, 2026',
    initials: 'RT',
    avatarColor: 'bg-teal-600',
  },
];

const STATUS_STYLES = {
  'In Stock': 'text-green-400',
  'Low Stock': 'text-yellow-400',
  'Out of Stock': 'text-red-400',
};

export default function AdminInventory() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [items, setItems] = useState(INITIAL_INVENTORY);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  const handleAdd = () => {
    navigate('/inventory/add');
  };

  const handleEdit = (id) => {
    navigate(`/inventory/edit/${id}`);
  };

  const handleDelete = (id) => {
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
              onClick={handleAdd}
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
                  <div
                    className={`w-9 h-9 rounded-full ${item.avatarColor} flex items-center justify-center text-white text-xs font-semibold shrink-0`}
                  >
                    {item.initials}
                  </div>
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
                    onClick={() => handleEdit(item.id)}
                    className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
    </div>
  );
}