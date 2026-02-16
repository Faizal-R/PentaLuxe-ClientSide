import { ChangeEvent, useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/apiService";
import GoogleAuth from "@/components/GoogleAuthentication/GoogleAuth";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { useDispatch, useSelector } from "react-redux";
import { LogIn } from "@/store/slices/userSlice";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.user);

  const LoginHandler = async () => {
    if (email.trim() === "" || password.trim() === "") {
      toast.error("Email & Password are required");
      return;
    }

    try {
      const response = await api.post(USER_API_ROUTES.AUTH.LOGIN, { email, password });
      const data = response.data.data;

      if (response.status === AppHttpStatusCodes.OK) {
        dispatch(LogIn());
        localStorage.setItem("accessToken", data.accessToken);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen grid md:grid-cols-2 text-black">
      {/* Left Luxury Branding Section */}
      <div className="hidden md:flex flex-col justify-center items-center bg-black text-white px-16 relative">
        <div className="absolute inset-0 bg-[url('/assets/Woman_in_Gold_RVB_72dpi_desktop.webp')] bg-cover bg-center opacity-30"></div>

        <div className="relative z-10 text-center space-y-6">
          <h1 className="text-5xl tracking-widest font-light">PENTALUXE</h1>
          <p className="text-sm tracking-[0.3em] text-gray-300 uppercase">
            Luxury Perfume Collection
          </p>
          <div className="w-20 h-[1px] bg-yellow-500 mx-auto"></div>
          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
            Discover timeless fragrances crafted with elegance, passion, and
            sophistication.
          </p>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          {/* Brand for mobile */}
          <div className="md:hidden text-center mb-10">
            <h1 className="text-3xl tracking-widest font-light text-black">
              PENTALUXE
            </h1>
            <div className="w-16 h-[1px] bg-yellow-500 mx-auto mt-2"></div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign In</h2>
          <p className="text-sm text-gray-500 mb-8">
            Access your exclusive fragrance collection
          </p>

          {/* Google Auth */}
          <div className="mb-6">
            <GoogleAuth text="Continue with Google" />
          </div>

          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-xs text-gray-400 tracking-wider">
              OR
            </span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm text-gray-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition"
            />
          </div>

          <div className="flex justify-end mb-6">
            <Link
              to="/forgot-password/email"
              className="text-sm text-gray-600 hover:text-black"
            >
              Forgot password?
            </Link>
          </div>

          <button
            onClick={LoginHandler}
            className="w-full mt-2 py-3 rounded-lg bg-black text-white font-medium tracking-wide transition-all duration-300 hover:bg-gray-800 active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            Login
          </button>

          <div className="text-center mt-6 text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-black font-medium hover:text-yellow-600"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
