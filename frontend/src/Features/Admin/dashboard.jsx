import { useState, useEffect } from 'react';
import SalesChart from './components/SalesChart';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ").filter(Boolean);
    return parts.length === 1 
      ? parts[0][0].toUpperCase() 
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    fetch('http://localhost:8000/dashboard/admin-dashboard', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to fetch dashboard:", err));
  }, []);

  if (loading) return <div className="p-8 font-black text-neutral-600">LOADING DASHBOARD...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black mb-8">DASHBOARD</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        {[
          { label: 'Total products', val: dashboardData.inventory.total_products },
          { label: 'Total variants', val: dashboardData.inventory.total_variants },
          { label: 'Low stock', val: dashboardData.inventory.low_stock_count },
          { label: 'Total staff', val: dashboardData.staff.total_staff },
          { label: 'Transactions today', val: dashboardData.sales_today.total_transactions },
          { label: "Today's sales", val: `₱${dashboardData.sales_today.total_sales.toLocaleString()}` },
        ].map((stat, i) => (
          <div key={i} className="bg-neutral-100 p-4 rounded-xl border border-neutral-200 shadow-sm">
            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-black mt-1 text-neutral-900">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-neutral-100 p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h3 className="font-black text-sm mb-4 uppercase text-neutral-900">Low stock alerts</h3>
          <div className="space-y-3">
            {dashboardData.low_stock_alerts.map((item) => (
              <p key={item.variant_id} className="text-xs font-bold text-red-600 border-l-2 border-red-200 pl-3">
                {item.product_name} <span className="text-neutral-500">({item.size})</span> - {item.quantity_in_stock} LEFT
              </p>
            ))}
          </div>
        </div>

        <div className="bg-neutral-100 p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h3 className="font-black text-sm mb-4 uppercase text-neutral-900">Recent Transactions</h3>
          {dashboardData.recent_transactions.map((tx) => (
            <div key={tx.transaction_id} className="flex justify-between items-center py-3 border-b border-neutral-200 last:border-0">
              <span className="text-xs font-bold text-neutral-600">ID: {tx.transaction_id}</span>
              <span className="text-xs font-black text-neutral-900">₱{tx.total_amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-neutral-100 p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h3 className="font-black text-sm mb-4 uppercase text-neutral-900">Staff Accounts</h3>
          <div className="space-y-3">
            {dashboardData.staff.staff_list.map((member) => (
              <div key={member.user_id} className="flex items-center gap-3 p-2 border-b border-neutral-200 last:border-0">
                {/* Reusing getInitials logic */}
                <div className="w-10 h-10 bg-neutral-700 text-white rounded-full flex items-center justify-center font-black text-[10px]">
                  {getInitials(member.name || member.username)}
                </div>
                <div>
                  <p className="text-xs font-black text-neutral-900">{member.name || member.username}</p>
                  <p className="text-[10px] font-bold text-neutral-500">{member.email}</p>
                </div>
                
                <span 
                  className={`ml-auto shrink-0 flex items-center justify-center min-w-[50px] h-6 px-2 text-[10px] rounded-full font-black uppercase ${
                    member.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {/* Safety check: use "N/A" if role is missing/undefined */}
                  {(member.role || "staff").toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-100 p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h3 className="font-black text-sm mb-6 uppercase text-neutral-900">Sales Analytics</h3>
          <div className="h-48">
            {dashboardData.sales_analytics ? (
                <SalesChart data={dashboardData.sales_analytics} />
            ) : (
                <div className="h-full flex items-center justify-center text-neutral-400 text-xs font-bold">
                    NO DATA AVAILABLE
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}