import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";
import { useState, useEffect, ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ForgotOtpPage = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [seconds, setSeconds] = useState(120);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, []);

  useEffect(() => {
    if (seconds === 0) return;
    const interval = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const otpHandler = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        const next = document.getElementById(`otp-${index + 1}`);
        next?.focus();
      }
    }
  };

  const verifyOtp = async () => {
    setMessage("");

    const joinedOtp = otp.join("");

    if (joinedOtp.trim() === "") {
      setMessage("OTP is required");
      return;
    }

    try {
      const res = await api.post("/user/verfiy-reset-otp", {
        otp: joinedOtp,
        email,
      });

      if (res.status === AppHttpStatusCodes.OK) {
        setMessage(res.data.message);

        setTimeout(() => {
          navigate("/reset-password", { state: { email } });
        }, 1500);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setMessage(
          error.response?.data.message || "Something went wrong"
        );
      }
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
            Security Verification
          </p>
          <div className="w-20 h-[1px] bg-yellow-500 mx-auto"></div>
          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
            Enter the verification code sent to your email.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Verify OTP
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Code sent to <br />
            <span className="font-medium text-black">{email}</span>
          </p>

          {/* OTP BOXES */}
          <div className="flex justify-center gap-4 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => otpHandler(e, index)}
                maxLength={1}
                type="text"
                className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg
                           bg-white text-black caret-black
                           focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                           transition"
              />
            ))}
          </div>

          {/* VERIFY BUTTON */}
          <button
            onClick={verifyOtp}
            className="w-full py-3 rounded-lg bg-black text-white font-medium
                       hover:bg-gray-800 active:scale-[0.98]
                       transition shadow-md mb-4"
          >
            Verify OTP
          </button>

          {/* RESEND TIMER */}
          {seconds > 0 ? (
            <p className="text-sm text-gray-400">
              Resend in {Math.floor(seconds / 60)}:
              {String(seconds % 60).padStart(2, "0")}
            </p>
          ) : (
            <button
              className="text-black font-medium hover:underline"
              onClick={() => setSeconds(120)}
            >
              Resend OTP
            </button>
          )}

          {/* MESSAGE */}
          {message && (
            <p
              className={`mt-4 text-sm ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotOtpPage;
