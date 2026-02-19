import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "@/services/user/AuthService";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      return;
    }
    if (newPassword !== confirmPassword) {
      return;
    }

    const res = await AuthService.resetPassword({ newPassword, email });
    if (res.success) {
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-black text-white px-16 relative">
        <div className="absolute inset-0 bg-[url('/assets/Woman_in_Gold_RVB_72dpi_desktop.webp')] bg-cover bg-center opacity-30"></div>

        <div className="relative z-10 text-center space-y-6">
          <h1 className="text-5xl tracking-widest font-light">
            PENTALUXE
          </h1>
          <p className="text-sm tracking-[0.3em] text-gray-300 uppercase">
            New Credentials
          </p>
          <div className="w-20 h-[1px] bg-yellow-500 mx-auto"></div>
          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
            Create a strong, unique password for your account security.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Reset Password
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Enter your new security credentials
          </p>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         bg-white text-black placeholder:text-gray-400
                         focus:ring-2 focus:ring-black focus:border-black
                         outline-none transition"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         bg-white text-black placeholder:text-gray-400
                         focus:ring-2 focus:ring-black focus:border-black
                         outline-none transition"
            />
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-lg bg-black text-white font-medium
                       hover:bg-gray-800 active:scale-[0.98]
                       transition shadow-md mt-6"
          >
            Update Password
          </button>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
