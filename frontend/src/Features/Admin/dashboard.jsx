import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/dashboard/admin-dashboard', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to fetch dashboard:", err));
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="py-8 pr-8">
      {/* pl-6 aligns the title perfectly with your grid content */}
      <h1 className="text-2xl font-black mb-8 pl-6">DASHBOARD</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8 pl-6">
        {[
          { label: 'Total products', val: dashboardData.inventory.total_products },
          { label: 'Total variants', val: dashboardData.inventory.total_variants },
          { label: 'Low stock', val: dashboardData.inventory.low_stock_count },
          { label: 'Total staff', val: dashboardData.staff.total_staff },
          { label: 'Transactions today', val: dashboardData.sales_today.total_transactions },
          { label: "Today's sales", val: `₱${dashboardData.sales_today.total_sales.toLocaleString()}` },
        ].map((stat, i) => (
          <div key={i} className="bg-neutral-100 p-4 rounded-xl shadow-sm border border-neutral-200">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">{stat.label}</p>
            <p className="text-xl font-black mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 pl-6">
        <div className="bg-neutral-100 p-6 rounded-2xl shadow-sm border border-neutral-200">
          <h3 className="font-black mb-4">Low stock alerts</h3>
          <div className="space-y-2">
            {dashboardData.low_stock_alerts.map((item) => (
              <p key={item.variant_id} className="text-sm font-bold text-red-600">
                {item.product_name} ({item.size}) - {item.quantity_in_stock} left
              </p>
            ))}
          </div>
        </div>
        <div className="bg-neutral-100 p-6 rounded-2xl shadow-sm border border-neutral-200">
          <h3 className="font-black mb-4">Recent Transactions</h3>
          {dashboardData.recent_transactions.map((tx) => (
            <div key={tx.transaction_id} className="flex justify-between text-sm py-1">
              <span className="font-bold">ID: {tx.transaction_id}</span>
              <span className="font-black">₱{tx.total_amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pl-6">
        <div className="bg-neutral-100 p-6 rounded-2xl shadow-sm border border-neutral-200">
          <h3 className="font-black mb-4">Staff Account</h3>
          <div className="space-y-3">
            {dashboardData.staff.staff_list.map((member) => (
              <div key={member.user_id} className="flex items-center gap-3 p-2 rounded-lg">
                <div className="w-10 h-10 bg-neutral-700 text-white rounded-full flex items-center justify-center font-black text-sm">
                  {member.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-black">{member.username}</p>
                  <p className="text-xs text-neutral-500">{member.email}</p>
                </div>
                <span className="ml-auto text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">ACTIVE</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-100 p-6 rounded-2xl shadow-sm border border-neutral-200 min-h-[250px]">
          <h3 className="font-black mb-4">Sales Analytics</h3>
        </div>
      </div>
    </div>
  );
}