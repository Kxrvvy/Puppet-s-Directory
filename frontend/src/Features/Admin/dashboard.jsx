import { useState } from 'react';
import AdminNavbar from './admin-navbar';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock data for Staff
  const staffMembers = [
    { name: 'Juan Dela Cruz', email: 'juan@puppets.com', initials: 'JD' },
    { name: 'Maria Santos', email: 'maria@puppets.com', initials: 'MS' },
    { name: 'Pedro Reyes', email: 'pedro@puppets.com', initials: 'PR' },
    { name: 'Ana Lopez', email: 'ana@puppets.com', initials: 'AL' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total products', val: 12 },
            { label: 'Total variants', val: 48 },
            { label: 'Low stock', val: 4 },
            { label: 'Total staff', val: 4 },
            { label: 'Transactions today', val: 14 },
            { label: "Today's sales", val: '₱5,240' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <p className="text-[10px] text-gray-500 font-bold uppercase">{stat.label}</p>
              <p className="text-xl font-bold mt-1">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Middle Section: Low Stock & Transactions */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <h3 className="font-bold mb-4">Low stock alerts</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <h3 className="font-bold mb-4">Recent Transactions</h3>
          </div>
        </div>

        {/* Bottom Section: Staff Account & Sales Analytics */}
        <div className="grid grid-cols-2 gap-8">
          {/* Staff Account Container */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold mb-4">Staff Account</h3>
            <div className="space-y-3">
              {staffMembers.map((member, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                  <span className="ml-auto text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">ACTIVE</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Analytics Container */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[250px]">
            <h3 className="font-bold mb-4">Sales Analytics</h3>
            {/* Add your chart component here */}
          </div>
        </div>
      </main>
    </div>
  );
}