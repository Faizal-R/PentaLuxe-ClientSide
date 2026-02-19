import { useEffect, useState } from "react";
import { ProfileService } from "@/services/user/ProfileService";
import { errorToast } from "@/utils/customToast";
import { pentaluxeTheme } from "@/theme";
import { User, Mail, Phone, ShieldCheck, Sparkles, Save } from "lucide-react";

export interface IUser {
  username: string;
  email: string;
  phone: number | string;
}

const Profile = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const getUserProfile = async () => {
    const res = await ProfileService.getProfile();
    if (res.success) {
      setUser(res.data);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof IUser) => {
    if (user) {
      setUser({
        ...user,
        [field]: field === "phone" ? Number(e.target.value) : e.target.value,
      });
    }
  };

  const updateInformation = async () => {
    if (!user?.username.trim() || !user?.email.trim() || !user?.phone) {
      errorToast("Please fill in all required profile fields");
      return;
    }
    
    setIsUpdating(true);
    const res = await ProfileService.updateProfile(user);
    if (res.success) {
      // Success toast is handled by the service
    }
    setIsUpdating(false);
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl">
      
      {/* Header - Compact */}
      <div className="space-y-2">
         <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500 tracking-[0.3em] uppercase text-[9px] font-bold">User Profile</span>
         </div>
         <h1 className="text-2xl md:text-3xl font-serif text-white uppercase italic">Account <span className="text-emerald-500">Details.</span></h1>
         <p className="text-slate-500 text-[11px] font-light max-w-lg">
           Manage your personal account information. Your details are used for order verification and shipping updates.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Profile Card - Compact Width */}
        <div 
          className="md:col-span-7 space-y-6 bg-emerald-950/[0.03] border border-emerald-500/10 p-8"
          style={{ borderRadius: pentaluxeTheme.button.radius }}
        >
           <div className="space-y-5">

              {/* Username */}
              <div className="space-y-2 group">
                 <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                    <User className="w-2.5 h-2.5" />
                    Full Name
                 </label>
                 <input
                   type="text"
                   placeholder="Your full name"
                   className="w-full bg-black/40 border-b border-emerald-500/10 px-0 py-2 text-base font-serif text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-800"
                   value={user?.username || ""}
                   onChange={(e) => handleInputChange(e, "username")}
                 />
              </div>

              {/* Email */}
              <div className="space-y-2 group">
                 <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                    <Mail className="w-2.5 h-2.5" />
                    Email Address
                 </label>
                 <input
                   type="email"
                   placeholder="your@email.com"
                   className="w-full bg-black/40 border-b border-emerald-500/10 px-0 py-2 text-base font-serif text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-800"
                   value={user?.email || ""}
                   onChange={(e) => handleInputChange(e, "email")}
                 />
              </div>

              {/* Phone */}
              <div className="space-y-2 group">
                 <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                    <Phone className="w-2.5 h-2.5" />
                    Phone Number
                 </label>
                 <input
                   type="number"
                   placeholder="Contact Number"
                   className="w-full bg-black/40 border-b border-emerald-500/10 px-0 py-2 text-base font-mono text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-800"
                   value={user?.phone || ""}
                   onChange={(e) => handleInputChange(e, "phone")}
                 />
              </div>
           </div>

           <button
             onClick={updateInformation}
             disabled={isUpdating}
             className="w-full mt-4 py-3.5 bg-emerald-600 text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all flex items-center justify-center gap-3 group"
             style={{ borderRadius: pentaluxeTheme.button.radius }}
           >
             {isUpdating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />}
             Update Profile
           </button>
        </div>

        {/* Membership Info - Compact Side Panel */}
        <div className="md:col-span-5 space-y-6">
           <div className="p-6 border border-emerald-500/10 bg-emerald-500/[0.01] space-y-3">
              <h4 className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Membership Status</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-light">Exclusive access to limited-edition decants and curated fragrance archives.</p>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-black/40 border border-emerald-500/5 text-center space-y-1">
                 <p className="text-[8px] uppercase tracking-widest text-slate-600">Member Since</p>
                 <p className="text-lg font-mono text-emerald-400">1.2 Years</p>
              </div>
              <div className="p-5 bg-black/40 border border-emerald-500/5 text-center space-y-1">
                 <p className="text-[8px] uppercase tracking-widest text-slate-600">Total Orders</p>
                 <p className="text-lg font-mono text-emerald-400">24 Orders</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

