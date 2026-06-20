import { useEffect,useState } from 'react';
import AdminNavbar from './Admin/admin-navbar';
import LogoutModal from '../Features/logoutModal';
import { Outlet, useNavigate } from 'react-router-dom';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', role: '' });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    setIsLogoutModalOpen(false);
  };

  useEffect(() => {
    fetch('http://localhost:8000/auth/me', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setUserData({ name: data.username, role: data.role }))
      .catch(err => console.error("Failed to fetch user:", err));
  }, []);

  return (
    <div className="relative flex min-h-screen bg-gray-50">
      <AdminNavbar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        userName={userData.name}
        userRole={userData.role}
        onLogout={() => setIsLogoutModalOpen(true)} 
      />

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Outlet /> 
      </main>

      {isLogoutModalOpen && (
        <LogoutModal 
          isOpen={isLogoutModalOpen} 
          onClose={() => setIsLogoutModalOpen(false)} 
          onConfirm={handleLogout} 
        />
      )}
    </div>
  );
}