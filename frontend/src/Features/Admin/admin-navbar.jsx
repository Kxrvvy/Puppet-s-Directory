import { useNavigate } from 'react-router-dom';
import { User, Menu, X, LayoutDashboard, Package, FileText, Users, UserCircle, LogOut } from 'lucide-react';
import Logo from '../../assets/logo.png'; 

export default function AdminNavbar({ isOpen, setIsOpen, userRole = "Admin", userName = "Admin User", onLogout }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Staff', path: '/staff', icon: <Users size={20} /> },
  ];

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ").filter(part => part.length > 0);
    return parts.length === 1 
      ? parts[0].substring(0, 2).toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <nav className={`fixed left-0 top-0 h-full bg-neutral-900 p-6 flex flex-col justify-between text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div>
        <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-10 h-10 rounded-full bg-neutral-600 mb-8 flex items-center justify-center hover:bg-neutral-500 transition-all text-white"
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
              className="flex items-center gap-4 w-full p-2 text-[14px] rounded hover:bg-gray-700 transition"
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </button>
          ))}
        </div>
      </div>
      
      {/* Bottom Profile Section */}
      <div className={`flex items-center gap-3 p-2 ${!isOpen ? 'justify-center' : ''}`}>
        
        {/* Container for Avatar and Logout Overlay */}
        <div className="relative group w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-sm shrink-0 overflow-hidden">
          {getInitials(userName)}

          {/* Logout Overlay - Hidden by default, visible on group-hover */}
          <button 
            onClick={onLogout}
            className="absolute inset-0 w-full h-full bg-neutral-800/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            title="Logout"
          >
            <LogOut size={20} className="text-red-400" />
          </button>
        </div>
        
        {/* User Details (Only visible when open) */}
        {isOpen && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold truncate">{userName}</span>
            <span className="text-[10px] text-gray-400 capitalize">{userRole}</span>
          </div>
        )}
      </div>
    </nav>
  );
}