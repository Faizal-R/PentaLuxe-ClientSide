import React, { useEffect, useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/apiService";
import GoogleAuth from "@/components/GoogleAuthentication/GoogleAuth";
import { toast } from "sonner";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { PulseLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    if (user) navigate("/");
  }, []);

  const registerHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    if (!username.trim()) return toast.error("Username is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!password.trim() || !confirmPassword.trim())
      return toast.error("Passwords are required");
    if (password !== confirmPassword)
      return toast.error("Passwords don't match");
    if (!phone) return toast.error("Phone number is required");
    if (phone.length !== 10)
      return toast.error("Phone number must have exactly 10 digits");

    try {
      setIsLoading(true);

      const response = await api.post(USER_API_ROUTES.AUTH.REGISTER, {
        email,
        username,
        password,
        phone,
      });

      if (response.status === AppHttpStatusCodes.CREATED) {
        toast.success(response.data.message);
        navigate(`/otp-verify/${email}`);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data.message || "Network error or other issue",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-black text-white px-16 relative">
        <div className="absolute inset-0 bg-[url('/assets/Woman_in_Gold_RVB_72dpi_desktop.webp')] bg-cover bg-center opacity-30"></div>

        <div className="relative z-10 text-center space-y-6">
          <h1 className="text-5xl tracking-widest font-light">PENTALUXE</h1>
          <p className="text-sm tracking-[0.3em] text-gray-300 uppercase">
            Luxury Perfume Collection
          </p>
          <div className="w-20 h-[1px] bg-yellow-500 mx-auto"></div>
          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
            Elevate your fragrance experience with timeless elegance.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-50 px-6 py-5">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Mobile Brand */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl tracking-widest font-light text-black">
              PENTALUXE
            </h1>
            <div className="w-16 h-[2px] bg-yellow-500 mx-auto mt-3"></div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Join and discover your signature fragrance.
          </p>

          <div className="mb-6">
            <GoogleAuth text="Sign up with Google" />
          </div>

          <div className="flex items-center mb-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* FORM GRID */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           bg-white text-black placeholder:text-gray-400
                           caret-black
                           focus:ring-2 focus:ring-black focus:border-black
                           focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value)
                }
                placeholder="9876543210"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           bg-white text-black placeholder:text-gray-400
                           caret-black
                           focus:ring-2 focus:ring-black focus:border-black
                           focus:outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           bg-white text-black placeholder:text-gray-400
                           caret-black
                           focus:ring-2 focus:ring-black focus:border-black
                           focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           bg-white text-black placeholder:text-gray-400
                           caret-black
                           focus:ring-2 focus:ring-black focus:border-black
                           focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           bg-white text-black placeholder:text-gray-400
                           caret-black
                           focus:ring-2 focus:ring-black focus:border-black
                           focus:outline-none transition"
              />
            </div>
          </div>

          <button
            onClick={registerHandler}
            disabled={isLoading}
            className="w-full mt-8 py-3 rounded-lg bg-black text-white font-medium tracking-wide transition-all duration-300 hover:bg-gray-800 active:scale-[0.98] shadow-md disabled:opacity-70"
          >
            {isLoading ? (
              <PulseLoader size={8} color="#fff" />
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black font-medium hover:text-yellow-600"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
