import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { User, Mail, Lock, Phone, Sparkles, UserPlus, ArrowRight, RefreshCcw, ShieldCheck } from "lucide-react";

import GoogleAuth from "@/components/GoogleAuthentication/GoogleAuth";
import { AuthService } from "@/services/user/AuthService";

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const user = useSelector((state: { user: { user: { name?: string, email: string } } }) => state.user.user);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleRegister = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim() || !phone) {
      toast.error("Please fill in all required fields to proceed");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    setIsLoading(true);
    const res = await AuthService.register({ email, username, password, phone });
    
    if (res.success) {
      navigate(`/otp-verify/${email}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 selection:bg-emerald-500 selection:text-black">
      
      {/* Left Column: Branding Experience */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-[#05070a] relative overflow-hidden px-20">
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-black" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
         
         <div className="relative z-10 space-y-12 text-center">
            <div className="space-y-4">
               <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-12 bg-emerald-500/40" />
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <div className="h-px w-12 bg-emerald-500/40" />
               </div>
               <h1 className="text-7xl font-serif text-white tracking-widest leading-none">PENTA<span className="text-emerald-500 italic">LUXE</span></h1>
               <p className="text-xs tracking-[0.6em] text-emerald-500/60 uppercase font-bold">Join the Collection</p>
            </div>
            
            <p className="text-slate-500 text-sm font-light max-w-sm mx-auto leading-relaxed">
               Begin your journey as a Pentaluxe curator. Gain access to the world's most exclusive olfactory archives and limited manifestations.
            </p>

             <div className="pt-12 text-[10px] tracking-[0.4em] text-emerald-500/20 uppercase font-bold border-t border-emerald-500/10 inline-block px-12">
                Create Your Account
             </div>
         </div>
      </div>

      {/* Right Column: Interaction Section */}
      <div className="flex items-center justify-center bg-[#05070a] px-6 py-12 lg:border-l border-emerald-500/10 overflow-y-auto">
         <div className="w-full max-w-2xl space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 my-auto">
            
            {/* Header */}
            <div className="text-center lg:text-left space-y-2">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                   <UserPlus className="w-4 h-4 text-emerald-500" />
                   <span className="text-emerald-500 tracking-[0.4em] uppercase text-[10px] font-bold">Sign Up</span>
                </div>
                <h2 className="text-4xl font-serif text-white">Join <span className="text-emerald-500 italic">Us.</span></h2>
                <p className="text-slate-500 text-xs tracking-widest uppercase font-bold">Create an account to start your journey.</p>
             </div>

            {/* Interaction Area */}
            <div className="space-y-10">
               
                {/* Google Auth */}
                <div className="group pentaluxe-google-btn">
                   <GoogleAuth text="Sign up with Google" />
                </div>

                <div className="flex items-center gap-4 text-emerald-500/10">
                   <div className="h-px flex-grow bg-current" />
                   <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Or sign up with email</span>
                   <div className="h-px flex-grow bg-current" />
                </div>

               {/* Inputs Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="group space-y-2">
                      <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                         <User className="w-3 h-3" />
                         Full Name
                      </label>
                     <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-emerald-950/[0.03] border-b border-emerald-500/10 px-0 py-4 text-lg font-serif text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-900 font-light"
                     />
                  </div>

                  <div className="group space-y-2">
                      <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                         <Phone className="w-3 h-3" />
                         Phone Number
                      </label>
                     <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-emerald-950/[0.03] border-b border-emerald-500/10 px-0 py-4 text-lg font-mono text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-900"
                     />
                  </div>

                  <div className="md:col-span-2 group space-y-2">
                      <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                         <Mail className="w-3 h-3" />
                         Email Address
                      </label>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@pentaluxe.com"
                        className="w-full bg-emerald-950/[0.03] border-b border-emerald-500/10 px-0 py-4 text-lg font-serif text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-900 font-light"
                     />
                  </div>

                  <div className="group space-y-2">
                      <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                         <Lock className="w-3 h-3" />
                         Password
                      </label>
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-emerald-950/[0.03] border-b border-emerald-500/10 px-0 py-4 text-lg font-mono text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-900"
                     />
                  </div>

                  <div className="group space-y-2">
                      <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                         <ShieldCheck className="w-3 h-3" />
                         Confirm Password
                      </label>
                     <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-emerald-950/[0.03] border-b border-emerald-500/10 px-0 py-4 text-lg font-mono text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-900"
                     />
                  </div>
               </div>

               {/* Actions */}
               <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full py-5 bg-emerald-600 text-black text-[12px] font-bold uppercase tracking-[0.5em] hover:bg-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-4 group rounded-sm"
               >
                   {isLoading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                   Create Account
                </button>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-emerald-500/5">
                 <p className="text-[10px] tracking-widest text-slate-500 uppercase font-bold">
                   Already have an account?{" "}
                   <Link to="/login" className="text-emerald-500 hover:text-emerald-400 transition-colors ml-4 flex items-center justify-center gap-2 mt-4">
                     Login <ArrowRight className="w-3 h-3" />
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
           width: 100% !important;
           justify-content: center !important;
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

export default SignupPage;
