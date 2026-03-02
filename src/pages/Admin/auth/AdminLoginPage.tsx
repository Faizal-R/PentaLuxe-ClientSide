import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuthService } from "@/services/admin/AdminAuthService";
import { ShieldCheck, Mail, Lock, ChevronRight, Fingerprint, Activity } from "lucide-react";
import { PulseLoader } from "react-spinners";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const AdminLoginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await AdminAuthService.login({ email, password });
    if (res.success || res.token) {
      localStorage.setItem("adminToken", res.token);
      navigate("/admin/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c1110] selection:bg-emerald-500 selection:text-black overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse delay-1000" />

      {/* Main Container */}
      <div className="w-full max-w-6xl h-[650px] grid grid-cols-1 lg:grid-cols-2 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 bg-black/20 backdrop-blur-3xl m-6">
        
        {/* Left Section: Tactical Branding */}
        <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden bg-gradient-to-br from-[#0c1110] to-black border-r border-white/5">
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
           </div>

           <div className="relative z-10">
              <img src="/assets/PentaLuxeLogo.png" alt="Pentaluxe" className="w-48 mb-12 brightness-110" />
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-emerald-500" />
                    <span className="text-emerald-500 tracking-[0.4em] uppercase text-[9px] font-bold">Secure Systems Architecture</span>
                 </div>
                 <h2 className="text-5xl font-serif text-white tracking-tighter leading-tight">
                    Onyx Intelligence <br />
                    <span className="text-emerald-500/40">Terminal V1.0</span>
                 </h2>
              </div>
           </div>

           <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest">Protocol Integrity</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">End-to-End Encryption Active</p>
                 </div>
              </div>
              
              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-emerald-500/60 uppercase">System Status: Optimal</span>
                 </div>
                 <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">Hash: 0xPentaluxe_Secure</span>
              </div>
           </div>
        </div>

        {/* Right Section: Auth Portal */}
        <div className="flex flex-col justify-center items-center p-12 bg-white/[0.01]">
          <div className="w-full max-w-sm space-y-10">
            <div className="space-y-2 text-center">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                  <Fingerprint size={12} className="text-emerald-500" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500">Access Required</span>
               </div>
               <h1 className="text-3xl font-serif text-white tracking-tight">Authentication Portal</h1>
               <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">Enter Credentials for System Access</p>
            </div>

            <form onSubmit={AdminLoginHandler} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1">Administrative Mail</label>
                 <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@pentaluxe.com"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-800"
                      required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1">Secure Vector (Password)</label>
                 <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-800"
                      required
                    />
                 </div>
              </div>

              <div className="pt-4">
                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full py-5 bg-emerald-500 text-black text-[11px] font-bold uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white hover:shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98] disabled:opacity-50"
                 >
                   {loading ? <PulseLoader color="black" size={8} /> : (
                     <>
                        Initialize Linkage
                        <ChevronRight size={16} />
                     </>
                   )}
                 </button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-4 pt-10 border-t border-white/5 opacity-40">
               <Activity size={14} className="text-emerald-500" />
               <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Secure Session Protection Active</span>
            </div>
            
            <div className="text-[9px] text-slate-700 uppercase tracking-[0.3em] font-bold text-center">
              © {new Date().getFullYear()} Pentaluxe Systems. Internal Use Only.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
