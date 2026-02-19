
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Ticket, 
  ShoppingBag, 
  BarChart3, 
  Layers, 
  Tag, 
  LogOut 
} from "lucide-react";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const onAdminLoggOutHandler = async () => {
    localStorage.removeItem("adminToken");
    toast.success("Admin Logged Out Successfully");
    setTimeout(() => {
      navigate('/admin');
    }, 2000);
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Coupons", path: "/admin/coupons", icon: Ticket },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Sales Report", path: "/admin/sales-report", icon: BarChart3 },
    { name: "Categories", path: "/admin/categories", icon: Layers },
    { name: "Offers", path: "/admin/offer", icon: Tag },
  ];

  return (
    <div className="w-[18%] h-screen fixed top-0 left-0 bg-[#0c1110]/95 backdrop-blur-3xl border-r border-emerald-500/10 z-50 flex flex-col">
      <div className="p-8 pb-4">
        <img
          className="w-full h-auto object-contain brightness-110 contrast-125"
          src="/assets/PentaLuxeLogo.png"
          alt="PentaLuxe"
        />
        <div className="mt-4 flex items-center gap-2 px-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] uppercase tracking-[0.4em] text-emerald-500/60 font-bold">Admin Console</span>
        </div>
      </div>

      <nav className="flex-grow px-4 mt-6 overflow-y-auto scrollbar-hide">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <li className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                    : "text-slate-400 hover:bg-white/5 hover:text-emerald-400"
                }`}>
                  <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                    {item.name}
                  </span>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-emerald-500/5">
        <button
          onClick={onAdminLoggOutHandler}
          className="group w-full flex items-center gap-4 px-4 py-4 text-red-400/60 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all duration-300"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em]">System Exit</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSideBar;
