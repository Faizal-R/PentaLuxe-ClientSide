import { useState, useEffect, ChangeEvent, KeyboardEvent, ClipboardEvent, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles, RefreshCcw, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { AuthService } from "@/services/user/AuthService";
import { toast } from "sonner";

const ForgotOtpPage = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [seconds, setSeconds] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) navigate("/forgot-password/email");
  }, [email, navigate]);

  useEffect(() => {
    if (seconds === 0) return;
    const interval = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    pasteData.split("").forEach((char, index) => {
      if (index < 4) newOtp[index] = char;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(pasteData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  const resendOTP = async () => {
    setIsResending(true);
    const res = await AuthService.sendResetOtp(email);
    if (res.success) {
      setOtp(["", "", "", ""]);
      setSeconds(120);
      inputRefs.current[0]?.focus();
    }
    setIsResending(false);
  };

  const verifyOtp = async () => {
    const joinedOtp = otp.join("");
    if (joinedOtp.length < 4) {
      toast.error("Please enter the full 4-digit code");
      return;
    }

    setIsLoading(true);
    const res = await AuthService.verifyResetOtp({
      otp: joinedOtp,
      email,
    });

    if (res.success) {
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 500);
    }
    setIsLoading(false);
  };

  const backHandler = () => {
    navigate("/forgot-password/email");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 selection:bg-emerald-500 selection:text-black">
      
      {/* Left Column: Branding Experience */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-[#05070a] relative overflow-hidden px-20">
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
                Secure access recovery. Please verify your ownership to reset your credentials.
             </p>

            <div className="pt-12 text-[10px] tracking-[0.4em] text-emerald-500/20 uppercase font-bold border-t border-emerald-500/10 inline-block px-12">
               Established MMXXIV
            </div>
         </div>
      </div>

      {/* Right Column: Interaction Section */}
      <div className="flex items-center justify-center bg-[#05070a] px-6 py-12 lg:border-l border-emerald-500/10">
         <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000">
            
            {/* Header */}
            <div className="text-center lg:text-left space-y-4">
                <button 
                  onClick={backHandler}
                  className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-500/40 hover:text-emerald-500 transition-colors font-bold mb-6"
                >
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  Back to Recovery
                </button>

                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   <span className="text-emerald-500 tracking-[0.4em] uppercase text-[10px] font-bold">Security Verification</span>
                </div>
                <h2 className="text-4xl font-serif text-white">Reset <span className="text-emerald-500 italic">Access.</span></h2>
                <div className="space-y-2">
                  <p className="text-slate-500 text-xs tracking-widest uppercase font-bold">Enter the verification code sent to</p>
                  <div className="flex items-center justify-center lg:justify-start gap-2 py-1 px-3 bg-emerald-500/5 border border-emerald-500/10 rounded-full w-fit">
                    <Mail className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500 text-[11px] font-mono tracking-wider">{email}</span>
                  </div>
                </div>
             </div>

            {/* OTP Area */}
            <div className="space-y-10">
               
               {/* Digit Inputs */}
               <div className="flex justify-between gap-4">
                 {otp.map((digit, index) => (
                   <div key={index} className="relative group">
                     <input
                       ref={(el) => (inputRefs.current[index] = el)}
                       type="text"
                       inputMode="numeric"
                       maxLength={1}
                       value={digit}
                       onChange={(e) => handleInputChange(e, index)}
                       onKeyDown={(e) => handleKeyDown(e, index)}
                       onPaste={index === 0 ? handlePaste : undefined}
                       className="w-16 h-20 bg-emerald-950/[0.03] border-b-2 border-emerald-500/10 text-center text-3xl font-serif text-white focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all duration-300"
                     />
                     <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                   </div>
                 ))}
               </div>

               {/* Resend Logic */}
               <div className="flex flex-col items-center lg:items-start gap-4">
                  {seconds > 0 ? (
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-emerald-500/10" />
                          <circle
                            cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="transparent"
                            strokeDasharray={88}
                            strokeDashoffset={88 - (88 * seconds) / 120}
                            className="text-emerald-500 transition-all duration-1000"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-mono text-emerald-500">{seconds}</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">New code available in {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}</span>
                    </div>
                  ) : (
                    <button
                      onClick={resendOTP}
                      disabled={isResending}
                      className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 text-[10px] uppercase tracking-widest font-bold transition-colors disabled:opacity-50"
                    >
                      {isResending ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
                      Resend Verification Code
                    </button>
                  )}
               </div>

               {/* Actions */}
               <div className="space-y-6">
                   <button
                      onClick={verifyOtp}
                      disabled={isLoading || otp.some(d => !d)}
                      className="w-full py-5 bg-emerald-600 text-black text-[12px] font-bold uppercase tracking-[0.5em] hover:bg-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] disabled:bg-emerald-900/20 disabled:text-emerald-500/20 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 group rounded-sm"
                   >
                      {isLoading ? (
                        <RefreshCcw className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          Verify & Continue
                        </>
                      )}
                   </button>
               </div>
            </div>
         </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
};

export default ForgotOtpPage;

