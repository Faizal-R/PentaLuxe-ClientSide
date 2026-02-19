import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { errorToast } from "@/utils/customToast";
import { ShieldCheck, Mail, Lock, Sparkles, LogIn as LoginIcon, ArrowRight, RefreshCcw } from "lucide-react";

import GoogleAuth from "@/components/GoogleAuthentication/GoogleAuth";
import { LogIn } from "@/store/slices/userSlice";
import { AuthService } from "@/services/user/AuthService";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: { user: { user: { email: string } } }) => state.user.user);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      errorToast("Email and password are required");
      return;
    }

    setIsLoading(true);
    const res = await AuthService.login({ email, password });
    
    if (res.success) {
      const { data } = res;
      dispatch(LogIn());
      localStorage.setItem("accessToken", data.accessToken);
      navigate("/");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 selection:bg-emerald-500 selection:text-black">
      
      {/* Left Column: Branding Experience */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-[#05070a] relative overflow-hidden px-20">
         {/* Animated Background Layers */}
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-black" />
         <div className="absolute top-1/4 -left-12 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-emerald-500/5 blur-[150px] rounded-full" />
         
         <div className="relative z-10 space-y-12 text-center">
            <div className="space-y-4">
               <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-12 bg-emerald-500/40" />
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <div className="h-px w-12 bg-emerald-500/40" />
               </div>
                <h1 className="text-7xl font-serif text-white tracking-widest leading-none">PENTA<span className="text-emerald-500 italic">LUXE</span></h1>
                <p className="text-xs tracking-[0.6em] text-emerald-500/60 uppercase font-bold">Luxury Redefined</p>
             </div>
            
             <p className="text-slate-500 text-sm font-light max-w-sm mx-auto leading-relaxed">
                Sign in to access your exclusive collection and personalized experience.
             </p>

            <div className="pt-12 text-[10px] tracking-[0.4em] text-emerald-500/20 uppercase font-bold border-t border-emerald-500/10 inline-block px-12">
               Established MMXXIV
            </div>
         </div>
      </div>

      {/* Right Column: Interaction Section */}
      <div className="flex items-center justify-center bg-[#05070a] px-6 py-12 lg:border-l border-emerald-500/10">
         <div className="w-full max-w-lg space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000">
            
            {/* Header */}
            <div className="text-center lg:text-left space-y-2">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   <span className="text-emerald-500 tracking-[0.4em] uppercase text-[10px] font-bold">Login</span>
                </div>
                <h2 className="text-4xl font-serif text-white">Welcome <span className="text-emerald-500 italic">Back.</span></h2>
                <p className="text-slate-500 text-xs tracking-widest uppercase font-bold">Sign in to your account.</p>
             </div>

            {/* Interaction Area */}
            <div className="space-y-8">
               
               {/* Inputs */}
               <div className="space-y-6">
                  <div className="group space-y-2">
                      <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                         <Mail className="w-3 h-3" />
                         Email Address
                      </label>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="collector@pentaluxe.com"
                        className="w-full bg-emerald-950/[0.03] border-b border-emerald-500/10 px-0 py-4 text-lg font-serif text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-950 font-light"
                     />
                  </div>

                  <div className="group space-y-2">
                     <div className="flex justify-between items-center">
                         <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                            <Lock className="w-3 h-3" />
                            Password
                         </label>
                         <Link to="/forgot-password/email" className="text-[9px] uppercase tracking-widest text-emerald-500/40 hover:text-emerald-500 transition-colors font-bold">Forgot Password?</Link>
                     </div>
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-emerald-950/[0.03] border-b border-emerald-500/10 px-0 py-4 text-lg font-mono text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-950"
                     />
                  </div>
               </div>

               {/* Actions */}
               <div className="space-y-6">
                   <button
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full py-5 bg-emerald-600 text-black text-[12px] font-bold uppercase tracking-[0.5em] hover:bg-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-4 group rounded-sm"
                   >
                      {isLoading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <LoginIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                      Sign In
                   </button>

                   <div className="flex items-center gap-4 text-emerald-500/10">
                      <div className="h-px flex-grow bg-current" />
                      <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Or login with</span>
                      <div className="h-px flex-grow bg-current" />
                   </div>

                   <div className="group pentaluxe-google-btn">
                      <GoogleAuth text="Continue with Google" />
                   </div>
               </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-12 border-t border-emerald-500/5">
                 <p className="text-[10px] tracking-widest text-slate-500 uppercase font-bold">
                   Don't have an account?{" "}
                   <Link to="/register" className="text-emerald-500 hover:text-emerald-400 transition-colors ml-2 flex items-center justify-center gap-2 mt-4">
                     Sign Up <ArrowRight className="w-3 h-3" />
                   </Link>
                 </p>
            </div>
         </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .pentaluxe-google-btn button {
           background-color: transparent !important;
           border: 1px solid rgba(16, 185, 129, 0.1) !important;
           color: #94a3b8 !important;
           font-family: 'JetBrains Mono', monospace !important;
           text-transform: uppercase !important;
           letter-spacing: 0.2em !important;
           font-size: 10px !important;
           border-radius: 2px !important;
           transition: all 0.3s !important;
        }

        .pentaluxe-google-btn button:hover {
           border-color: rgba(16, 185, 129, 0.4) !important;
           color: white !important;
           background-color: rgba(16, 185, 129, 0.05) !important;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
