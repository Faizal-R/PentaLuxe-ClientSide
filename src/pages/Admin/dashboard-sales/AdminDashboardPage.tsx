
import { ADMIN_API_ROUTES } from "@/routes/api/AdminApiRoutes";
import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  Plus, 
  Layers, 
  Tag, 
  ChevronRight,
  Target
} from "lucide-react";
import { pentaluxeTheme } from "@/theme";

interface ITopSellingProduct {
  _id: {
    productName: string;
  };
  sum: number;
}
interface ITopSellingCategory {
  _id: {
    categoryName: string;
  };
  sum: number;
}

const QuickActions = [
  { id: 1, text: "Add Product", route: "/admin/products/add", icon: Plus },
  { id: 2, text: "Categories", route: "/admin/categories", icon: Layers },
  { id: 3, text: "Orders", route: "/admin/orders", icon: ShoppingBag },
  { id: 4, text: "Offers", route: "/admin/offer", icon: Tag },
];

const AdminDashboard = () => {
  const [filter, setFilter] = useState("yearly");
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [products, setProducts] = useState<ITopSellingProduct[]>([]);
  const [categories, setCategories] = useState<ITopSellingCategory[]>([]);

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const getAdminDashboard = async () => {
    const res = await api.get(ADMIN_API_ROUTES.DASHBOARD.GET(filter));
    if (res.status === AppHttpStatusCodes.OK) {
      const data = res.data.data;
      setSalesData(data.sales);
      setTotalSales(data.totalSales);
      setTotalOrders(data.totalOrders);
    }
  };

  const getBestSellingProducts = async () => {
    const res = await api.get(ADMIN_API_ROUTES.DASHBOARD.BEST_SELLING_PRODUCTS);
    if (res.status === AppHttpStatusCodes.OK) {
      setProducts(res.data.data);
    }
  };

  const getBestSellingCategory = async () => {
    const res = await api.get(ADMIN_API_ROUTES.DASHBOARD.BEST_SELLING_CATEGORIES);
    if (res.status === AppHttpStatusCodes.OK) {
      setCategories(res.data.data);
    }
  };

  useEffect(() => {
    getAdminDashboard();
    getBestSellingProducts();
    getBestSellingCategory();
  }, [filter]);

  return (
    <div className="space-y-8 pb-12">
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-500/10 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-emerald-500" />
             <span className="text-emerald-500 tracking-[0.4em] uppercase text-[9px] font-bold">Systems Oversight</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tighter">Onyx Intelligence</h1>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
           <span className="pl-4 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Temporal Filter</span>
           <select
             value={filter}
             onChange={handleFilterChange}
             className="bg-[#0c1110] text-emerald-500 text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl border border-emerald-500/20 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
           >
             <option value="yearly">Yearly Arc</option>
             <option value="monthly">Monthly Cycle</option>
           </select>
        </div>
      </header>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group overflow-hidden bg-gradient-to-br from-[#0c1110] to-black border border-white/5 rounded-[32px] p-8 shadow-2xl transition-all duration-500 hover:border-emerald-500/20">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp size={120} />
           </div>
           <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="flex items-center justify-between">
                 <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <ArrowUpRight size={20} />
                 </div>
                 <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Gross Revenue</span>
              </div>
              <div>
                 <p className="text-4xl font-mono font-bold text-white tracking-tighter">₹{totalSales.toLocaleString()}</p>
                 <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] uppercase tracking-widest text-emerald-500/60 font-bold">Total Sales Protocol Active</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="relative group overflow-hidden bg-gradient-to-br from-[#0c1110] to-black border border-white/5 rounded-[32px] p-8 shadow-2xl transition-all duration-500 hover:border-emerald-500/20">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShoppingBag size={120} />
           </div>
           <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="flex items-center justify-between">
                 <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                    <ChevronRight size={20} />
                 </div>
                 <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Acquisition Volume</span>
              </div>
              <div>
                 <p className="text-4xl font-mono font-bold text-white tracking-tighter">{totalOrders}</p>
                 <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[8px] uppercase tracking-widest text-blue-500/60 font-bold">Confirmed Orders Executed</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Tactical Quick Actions */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[32px] p-8 flex flex-col justify-between">
           <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-500/60">Rapid Commands</span>
              <h3 className="text-xl font-serif text-white">System Actions</h3>
           </div>
           <div className="grid grid-cols-2 gap-3 mt-6">
              {QuickActions.map(action => (
                <Link 
                  key={action.id} 
                  to={action.path} 
                  className="flex flex-col items-center justify-center gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group"
                >
                  <action.icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{action.text}</span>
                </Link>
              ))}
           </div>
        </div>
      </div>

      {/* Analytics & Performance Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Visualizer */}
        <section className="bg-gradient-to-br from-[#0c1110] to-black border border-white/5 rounded-[40px] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-serif text-white">Growth Trajectory</h2>
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">Aggregate Performance Analysis</p>
            </div>
            <Target className="w-5 h-5 text-emerald-500/40" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                  dataKey="field" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }} 
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#0c1110e6', border: '1px solid #10b98120', borderRadius: '16px', backdropFilter: 'blur(12px)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                  {salesData.map((_entry, index) => (
                    <Cell key={index} fill={index % 2 === 0 ? "#10b981" : "#10b98160"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Specimen Rankings */}
        <div className="space-y-8">
           <section className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
              <div className="p-8 pb-4">
                 <h2 className="text-xl font-serif text-white">Elixir Rankings</h2>
                 <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-500/60 font-bold">Top 5 Best Selling Specimens</p>
              </div>
              <div className="px-3 pb-6">
                 <table className="w-full">
                    <thead>
                       <tr className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 border-b border-white/5">
                          <th className="px-6 py-4 text-left font-mono">Rank</th>
                          <th className="px-6 py-4 text-left">Specimen</th>
                          <th className="px-6 py-4 text-right font-mono">Volume</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                       {products.slice(0, 5).map((product, index) => (
                          <tr key={index} className="group hover:bg-emerald-500/[0.02] transition-colors">
                             <td className="px-6 py-4 font-mono text-[11px] text-emerald-500/40">0{index + 1}</td>
                             <td className="px-6 py-4">
                                <span className="text-[11px] font-bold text-slate-300 group-hover:text-emerald-400 transition-colors uppercase tracking-widest">{product._id.productName}</span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono text-white font-bold">{product.sum}</span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </section>

           <section className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
              <div className="p-8 pb-4 flex justify-between items-center">
                 <div>
                    <h2 className="text-xl font-serif text-white">Category Flux</h2>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-blue-500/60 font-bold">Top Selling Sectors</p>
                 </div>
                 <Layers size={20} className="text-blue-500/30" />
              </div>
              <div className="px-3 pb-6">
                 <div className="grid grid-cols-1 gap-2">
                    {categories.slice(0, 3).map((category, index) => (
                       <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 group hover:border-blue-500/20 transition-all">
                          <div className="flex items-center gap-4">
                             <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-[10px] font-mono font-bold text-blue-500/60">#0{index + 1}</span>
                             <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-blue-400 transition-colors">{category._id.categoryName}</span>
                          </div>
                          <span className="text-[12px] font-mono font-bold text-white">{category.sum}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
