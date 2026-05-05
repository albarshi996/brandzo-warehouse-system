import React from 'react';
import { Items_Master, Inbound_Log } from '../../data/brandzoSchema';

const BrandzoDashboard = () => {
  // Simple summary calculations from mock data
  const totalItems = Items_Master.length;
  const lowStockAlerts = Items_Master.filter(item => item.status === 'منخفض' || item.balance <= item.minStock).length;
  const totalInbound = Inbound_Log.reduce((acc, curr) => acc + curr.qty, 0);
  // Mocking outbound total for now as per schema
  const totalOutbound = Items_Master.reduce((acc, curr) => acc + curr.outbound, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-['Cairo']" dir="rtl">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Brandzo_Operatio</h1>
        <button
          className="rounded-lg bg-[#c0392b] px-6 py-2 font-bold text-white transition-colors hover:bg-[#8b1a1a]"
          onClick={() => alert('Barcode scanner coming soon!')}
        >
          Open Barcode Scanner
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Items Card */}
        <div className="rounded-xl border-t-4 border-[#c0392b] bg-white p-6 shadow-md">
          <div className="text-sm font-medium text-gray-500">إجمالي الأصناف</div>
          <div className="mt-2 text-3xl font-bold text-[#c0392b]">{totalItems}</div>
          <div className="text-xs text-gray-400 mt-1">Total Items</div>
        </div>

        {/* Low Stock Alerts Card */}
        <div className="rounded-xl border-t-4 border-[#e8b830] bg-white p-6 shadow-md">
          <div className="text-sm font-medium text-gray-500">تنبيهات نقص المخزون</div>
          <div className="mt-2 text-3xl font-bold text-[#e8b830]">{lowStockAlerts}</div>
          <div className="text-xs text-gray-400 mt-1">Low Stock Alerts</div>
        </div>

        {/* Total Inbound Card */}
        <div className="rounded-xl border-t-4 border-green-600 bg-white p-6 shadow-md">
          <div className="text-sm font-medium text-gray-500">إجمالي الوارد</div>
          <div className="mt-2 text-3xl font-bold text-green-600">{totalInbound}</div>
          <div className="text-xs text-gray-400 mt-1">Total Inbound</div>
        </div>

        {/* Total Outbound Card */}
        <div className="rounded-xl border-t-4 border-blue-600 bg-white p-6 shadow-md">
          <div className="text-sm font-medium text-gray-500">إجمالي الصادر</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{totalOutbound}</div>
          <div className="text-xs text-gray-400 mt-1">Total Outbound</div>
        </div>
      </div>

      <main className="mt-10">
        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-[#1a1a2e]">نظرة عامة على المخزون</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">الاسم (AR)</th>
                  <th className="px-4 py-3">الفئة</th>
                  <th className="px-4 py-3">الرصيد</th>
                  <th className="px-4 py-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Items_Master.map((item) => (
                  <tr key={item.sku} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono">{item.sku}</td>
                    <td className="px-4 py-3">{item.names.ar}</td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3 font-bold">{item.balance}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.status === 'متاح' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BrandzoDashboard;
