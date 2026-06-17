import { useNavigate } from 'react-router-dom';
import { User, Menu, X, LayoutDashboard, Package, FileText, Users, UserCircle } from 'lucide-react';
import Logo from '../../assets/logo.png'; // Placeholder logo, replace with actual logo path

export default function AdminNavbar({ isOpen, setIsOpen, userRole = "Admin" }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Staff', path: '/staff', icon: <Users size={20} /> },
  ];

  return (
    <nav className={`fixed left-0 top-0 h-full bg-gray-800 p-6 flex flex-col justify-between text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div>
        <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-10 h-10 rounded-full bg-gray-600 mb-8 flex items-center justify-center hover:bg-gray-500 transition-all text-white"
        >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo and Title Section */}
        {isOpen && (
        <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-14 rounded flex items-center justify-center text-xs font-bold shrink-0">
            <img src={Logo} alt="Logo" className="w-full h-full object-cover rounded" />
            </div>
            
            <div className="flex flex-col justify-center h-12">
            <h2 className="text-lg font-bold leading-none">
                PUPPET'S
            </h2>
            <span className="text-[10px] text-white tracking-widest uppercase">
                DIRECTORY
            </span>
            </div>
        </div>
        )}
        
        <div className="space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-4 w-full p-2 rounded hover:bg-gray-700 transition"
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-2">
        <button
        onClick={() => navigate('/profile')}
        className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-gray-600 transition-all duration-200"
        aria-label="Profile"
        >
        <User size={20} strokeWidth={2} />
        </button>
        {isOpen && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate">Employee ID</span>
            <span className="text-xs text-gray-400 capitalize">{userRole}</span>
          </div>
        )}
      </div>
    </nav>
  );
}