import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReportsPage = () => {
    const [reportData, setReportData] = useState(null);
    const [filter, setFilter] = useState('daily');
    const [loading, setLoading] = useState(true);

    const fetchReport = async (period) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8000/reports/${period}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReportData(response.data);
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReport(filter); }, [filter]);

    return (
        <div className="p-8">
            {/* Header matching Staff component */}
            <h1 className="text-2xl font-black mb-8">REPORTS</h1>
            
            {/* Filters matching your button style */}
            <div className="flex gap-4 mb-8">
                {['daily', 'weekly', 'monthly'].map((p) => (
                    <button 
                        key={p}
                        onClick={() => setFilter(p)}
                        className={`px-4 py-1 rounded-3xl font-black text-xs transition ${
                            filter === p ? 'bg-neutral-700 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                    >
                        {p.toUpperCase()}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-20">Loading analytics...</div>
            ) : (
                <>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                        <h2 className="text-lg font-semibold mb-6 font-black text-neutral-900 mb-4">TOP SELLING ITEMS</h2>
                        
                        {/* ONLY render the container if reportData exists and has items */}
                        {reportData && reportData.top_items && reportData.top_items.length > 0 ? (
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={reportData.top_items}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="product_name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="total_sold" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-500">
                                No sales data available.
                            </div>
                        )}
                    </div>

                    {/* Table Section matching Staff card typography */}
                    <div className="bg-neutral-100 p-6 rounded-xl border border-neutral-200 shadow-sm">
                        <h2 className="text-sm font-black text-neutral-900 mb-4">RECENT TRANSACTIONS</h2>
                        <table className="w-full text-left text-xs font-bold text-neutral-600">
                            <thead>
                                <tr className="border-b border-neutral-200 text-neutral-500">
                                    <th className="pb-3 font-black">ID</th>
                                    <th className="pb-3 font-black">AMOUNT</th>
                                    <th className="pb-3 font-black">METHOD</th>
                                    <th className="pb-3 font-black">DATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData?.recent_transactions?.map((tx) => (
                                    <tr key={tx.transaction_id} className="border-b border-neutral-200 last:border-0">
                                        <td className="py-4 font-black text-neutral-900">{tx.transaction_id}</td>
                                        <td className="py-4">₱{tx.total_amount?.toLocaleString()}</td>
                                        <td className="py-4 uppercase">{tx.payment_method}</td>
                                        <td className="py-4">{new Date(tx.purchased_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReportsPage;