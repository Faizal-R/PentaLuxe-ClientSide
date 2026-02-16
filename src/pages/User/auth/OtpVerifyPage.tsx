import React, { ChangeEvent, useEffect, useState } from "react";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/services/apiService";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { LogIn } from "@/store/slices/userSlice";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";

const OtpVerifyPage = () => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [seconds, setSeconds] = useState(120);
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    if (user) navigate("/");
  }, []);

  useEffect(() => {
    if (seconds === 0) return;
    const interval = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const resendOTP = async () => {
    try {
      const response = await api.post(USER_API_ROUTES.AUTH.RESEND_OTP, { email: id });
      if (response.data.success) {
        toast.success("OTP has been resent. Please check your email.");
        setOtp(["", "", "", ""]);
        setSeconds(120);
      } else {
        toast.error("Failed to resend OTP.");
      }
    } catch {
      toast.error("An error occurred while resending OTP.");
    }
  };

  const otpVerification = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      const otpCode = otp.join("");

      const response = await api.post(USER_API_ROUTES.AUTH.VERIFY_OTP, {
        otp: otpCode,
        email: id,
      });

      if (response.data.success) {
        dispatch(LogIn());
        localStorage.setItem(
          "accessToken",
          response.data.data.accessToken
        );
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message ||
            "An unexpected error occurred"
        );
      }
    }
  };

  function otpHandler(
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const value = event.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 3) {
        const next = document.getElementById(`otp-${index + 1}`);
        next?.focus();
      }
    }
  }

  const cancelHandler = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">

        <div className="flex justify-center mb-4 text-black">
          <MdOutlineMarkEmailUnread size={60} />
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Verify Your Email
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          We’ve sent a 4-digit code to
          <br />
          <span className="font-medium text-black">{id}</span>
        </p>

        {/* OTP INPUTS */}
        <div className="flex justify-center gap-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              value={digit}
              onChange={(e) => otpHandler(e, index)}
              maxLength={1}
              type="text"
              className="text-black w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                         transition"
            />
          ))}
        </div>

        {/* RESEND */}
        <div className="mb-6 text-sm">
          {seconds > 0 ? (
            <p className="text-gray-400">
              Resend in {Math.floor(seconds / 60)}:
              {String(seconds % 60).padStart(2, "0")}
            </p>
          ) : (
            <button
              onClick={resendOTP}
              className="text-black font-medium hover:underline"
            >
              Click to Resend OTP
            </button>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={cancelHandler}
            className="w-full py-2 border text-black border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={otpVerification}
            className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 active:scale-[0.98] transition"
          >
            Verify
          </button>
        </div>

      </div>
    </div>
  );
};

export default OtpVerifyPage;
