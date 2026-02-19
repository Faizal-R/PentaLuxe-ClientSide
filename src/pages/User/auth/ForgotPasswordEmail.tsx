import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/user/AuthService";

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const SendOtp = async () => {
    const res = await AuthService.sendResetOtp(email);
    if (res.success) {
      setTimeout(() => {
        navigate("/forgot-password/otp", { state: { email } });
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
            Reset Your Access
          </p>
          <div className="w-20 h-[1px] bg-yellow-500 mx-auto"></div>
          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
            Enter your registered email to receive a secure reset code.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            We’ll send you a verification OTP
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       bg-white text-black placeholder:text-gray-400
                       focus:ring-2 focus:ring-black focus:border-black
                       outline-none transition mb-4"
          />

          <button
            onClick={SendOtp}
            className="w-full py-3 rounded-lg bg-black text-white font-medium
                       hover:bg-gray-800 active:scale-[0.98]
                       transition shadow-md"
          >
            Send Reset OTP
          </button>

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;
