import PasswordToggleButton from "@/components/PasswordToggleButton";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Key, ShieldCheck, Lock, RefreshCcw, ArrowRight } from "lucide-react";
import { AuthService } from "@/services/user/AuthService";
import { ProfileService } from "@/services/user/ProfileService";

interface IUser {
  isPassword: boolean;
}

const ChangePassword = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const getUserProfile = async () => {
    const res = await ProfileService.getProfile();
    if (res.success) {
      setUser(res.data);
    } else if (res.status === 401) {
      navigate("/login");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (user?.isPassword && currentPassword.trim() === "") {
      setError("Current Password is required");
      return;
    }
    if (newPassword.trim() === "") {
      setError("New Password is required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      confirmPasswordRef.current?.focus();
      return;
    }

    setIsLoading(true);
    const res = await AuthService.changePassword({
      currentPassword,
      newPassword,
    });

    if (res.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError(res.message);
      currentPasswordRef.current?.focus();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-500 tracking-[0.4em] uppercase text-[10px] font-bold">
            Security Registry
          </span>
        </div>
        <h1 className="text-4xl font-serif text-white uppercase italic">
          Change <span className="text-emerald-500">Password.</span>
        </h1>
        <p className="text-slate-500 text-[11px] font-light leading-relaxed max-w-sm">
          Update your credentials to maintain the integrity of your archive.
        </p>
      </div>

      {/* Main Interaction Area */}
      <div className="max-w-sm mx-auto bg-emerald-950/[0.02] border border-emerald-500/10 p-5 sm:p-7 rounded-sm relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-700">
        {/* Subtle Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/[0.05 transition-all duration-700" />

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50/50 border border-red-100 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
              <p className="text-[11px] text-red-600 leading-tight flex-1">
                {error}
              </p>
            </div>
          )}
          <div className="space-y-6">
            {user?.isPassword && (
              <div className="group space-y-1">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors italic">
                  <Key className="w-3 h-3" />
                  Existing Credentials
                </label>
                <div className="relative">
                  <input
                    ref={currentPasswordRef}
                    type={isCurrentPasswordVisible ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="ENTER CURRENT SEQUENCE"
                    className="w-full bg-transparent border-b border-emerald-500/10 px-0 py-3 text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-950 font-light"
                  />
                  {currentPassword.length > 0 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity">
                      <PasswordToggleButton onClick={(visible: boolean) => setIsCurrentPasswordVisible(visible)} />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="group space-y-1">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors italic">
                <Lock className="w-3 h-3" />
                New Secret Sequence
              </label>
              <div className="relative">
                <input
                  type={isNewPasswordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="NEW COMPLEX PASSCODE"
                  className="w-full bg-transparent border-b border-emerald-500/10 px-0 py-3 text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-950 font-light"
                />
                {newPassword.length > 0 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity">
                    <PasswordToggleButton onClick={(visible: boolean) => setIsNewPasswordVisible(visible)} />
                  </div>
                )}
              </div>
            </div>

            <div className="group space-y-1">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors italic">
                <RefreshCcw className="w-3 h-3" />
                Verify Sequence
              </label>
              <div className="relative">
                <input
                  ref={confirmPasswordRef}
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="RE-RECORD SEQUENCE"
                  className="w-full bg-transparent border-b border-emerald-500/10 px-0 py-3 text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-950 font-light"
                />
                {confirmPassword.length > 0 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity">
                    <PasswordToggleButton onClick={(visible: boolean) => setIsConfirmPasswordVisible(visible)} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-grow py-4 bg-emerald-600 text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-all flex items-center justify-center gap-3 group rounded-sm disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCcw className="w-4 h-4 animate-spin text-black" />
              ) : (
                <>
                  Commit Changes <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-4 bg-transparent border border-emerald-500/10 text-emerald-500/40 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-emerald-500 hover:border-emerald-500/40 transition-all rounded-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="pt-8 border-t border-emerald-500/5 flex flex-col items-center gap-3">
        <p className="text-[9px] text-slate-700 uppercase tracking-[0.3em] font-bold">Access Protocol v2.4.0</p>
        <div className="flex gap-2">
          <div className="w-0.5 h-0.5 rounded-full bg-emerald-500/20" />
          <div className="w-0.5 h-0.5 rounded-full bg-emerald-500/20" />
          <div className="w-0.5 h-0.5 rounded-full bg-emerald-500/20" />
        </div>
      </div>

      <style>{`
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
};

export default ChangePassword;

