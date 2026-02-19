import { useEffect, useState } from "react";
import api from "../services/apiService";
import { AppHttpStatusCodes } from "../types/statusCode";
import { AxiosError } from "axios";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { logOut } from "@/store/slices/userSlice";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";
import { pentaluxeTheme } from "@/theme";
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Wallet, 
  Key, 
  LogOut,
  Sparkles,
  ChevronRight
} from "lucide-react";

interface IUser {
  username: string;
  email: string;
  phone: number | string;
}

const sideBarLinks = [
  {
    name: "My Profile",
    path: "/profile",
    icon: <User className="w-4 h-4" />,
    exact: true
  },
  {
    name: "Address Book",
    path: "/profile/address-book",
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    name: "My Orders",
    path: "/profile/orders",
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  {
    name: "My Wallet",
    path: "/profile/wallet",
    icon: <Wallet className="w-4 h-4" />,
  },
  {
    name: "Change Password",
    path: "/profile/change-password",
    icon: <Key className="w-4 h-4" />,
  },
  {
    name: "Logout",
    path: "/",
    icon: <LogOut className="w-4 h-4" />,
    action: 'logout'
  },
];

const UserProfileLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);

  const getUserProfile = async () => {
    try {
      const res = await api.get(USER_API_ROUTES.PROFILE.GET);
      if (res.status === AppHttpStatusCodes.OK) setUser(res.data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === AppHttpStatusCodes.NOT_FOUND) toast.error(error.response?.data.message);
        if (error.response?.status === AppHttpStatusCodes.UNAUTHORIZED) navigate("/login");
      }
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleLinkClick = (link: typeof sideBarLinks[0]) => {
    if (link.action === 'logout') {
      dispatch(logOut());
      localStorage.removeItem('accessToken');
      toast.success("Logged out successfully");
      navigate('/');
    }
  };

  return (
    <div 
      className="flex-grow flex selection:bg-emerald-500 selection:text-black overflow-hidden"
      style={{ backgroundColor: pentaluxeTheme.background, color: pentaluxeTheme.foreground }}
    >
      {/* Permanent Side Registry - Fixed and Compact */}
      <aside className="w-72 border-r border-emerald-500/10 flex-shrink-0 relative">
        <div className="fixed w-72 h-[calc(100vh-80px)] top-[80px] flex flex-col bg-background/50 backdrop-blur-sm">
           <div className="p-6 space-y-8 flex-grow">
              
               {/* User Profile Info - Scaled Down */}
               <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative group">
                     <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl font-serif text-emerald-500 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] transition-all duration-700">
                        {user?.username.slice(0, 1).toUpperCase()}
                     </div>
                     <div className="absolute -bottom-0.5 -right-0.5 p-1 bg-black border border-emerald-500/20 rounded-full">
                        <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                     </div>
                  </div>
                  <div className="space-y-0.5">
                     <h2 className="text-xl font-serif text-white tracking-wide">{user?.username}</h2>
                     <p className="text-[9px] text-emerald-500/40 uppercase tracking-[0.3em] font-bold italic">{user?.email}</p>
                  </div>
               </div>

              {/* Navigation Grid - Compact */}
              <nav className="flex flex-col gap-0.5 pt-2">
                 {sideBarLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      end={link.exact}
                      onClick={() => handleLinkClick(link)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3 transition-all duration-500 group ${
                          isActive && link.path !== '/'
                            ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/20' 
                            : 'text-slate-500 hover:text-white hover:bg-emerald-500/[0.02] border border-transparent'
                        }`
                      }
                      style={{ borderRadius: pentaluxeTheme.button.radius }}
                    >
                      <div className="flex items-center gap-4">
                         <span className="transition-transform group-hover:scale-110 duration-500 opacity-60 group-hover:opacity-100">{link.icon}</span>
                         <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{link.name}</span>
                      </div>
                      <ChevronRight className={`w-2.5 h-2.5 transition-transform group-hover:translate-x-1 ${link.action === 'logout' ? 'hidden' : 'opacity-0 group-hover:opacity-40'}`} />
                    </NavLink>
                 ))}
              </nav>
           </div>

           {/* Footer Citation - Slimmed Down */}
           <div className="p-6 border-t border-emerald-500/5 bg-emerald-500/[0.01]">
              <p className="text-[8px] text-slate-700 uppercase tracking-[0.3em] leading-relaxed text-center font-bold">
                 Private Curator Protocol<br />
                 MMXXIV Series One
              </p>
           </div>
        </div>
      </aside>

      {/* Main Registry Content - Taking full right side with minimal offset */}
      <main className="flex-grow p-12 lg:p-20 overflow-x-hidden pt-4">
         <div className="w-full">
            <Outlet />
         </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.1); }
      `}</style>
    </div>
  );
};

export default UserProfileLayout;
