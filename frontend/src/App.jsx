import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Features/login'; 
import AdminDashboard from './Features/Admin/dashboard';
import AdminInventory from './Features/Admin/Inventory';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Login Screen */}
        <Route path="/" element={<LoginPage />} />

        <Route path="/dashboard"  element={<AdminDashboard />} />
        <Route path="/inventory" element={<AdminInventory />} />
      </Routes>
    </Router>
  );
}