import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Features/login'; 
import AdminDashboard from './Features/Admin/dashboard';
import Staff from './Features/Admin/staff';
import MainLayout from './Features/MainLayout';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<MainLayout />}>
        <Route path="/dashboard"  element={<AdminDashboard />} />
        <Route path="/staff" element={<Staff />} />
        </Route>
      </Routes>
    </Router>
  );
}