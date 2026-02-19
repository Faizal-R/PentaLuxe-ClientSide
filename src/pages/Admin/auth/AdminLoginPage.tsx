import { useState } from "react";
import InputBox from "@/components/InputBox";
import Button from "@/components/Button/Button";
import { useNavigate } from "react-router-dom";
import { AdminAuthService } from "@/services/admin/AdminAuthService";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const AdminLoginHandler = async () => {
    const res = await AdminAuthService.login({ email, password });
    if (res.success || res.token) {
      localStorage.setItem("adminToken", res.token);
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 px-6">
      
      {/* Glass Card Container */}
      <div className="w-full max-w-5xl h-[550px] grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20">

        {/* Left Branding Section */}
        <div className="hidden md:flex flex-col justify-center items-center text-white bg-gradient-to-br from-indigo-600 to-purple-700 p-10 relative">
          
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold mb-4 tracking-wide">
              Admin Control Panel
            </h2>
            <p className="text-sm opacity-80 leading-relaxed max-w-sm">
              Secure access to your management dashboard.  
              Monitor users, manage operations, and maintain system integrity.
            </p>
          </div>
        </div>

        {/* Right Login Section */}
        <div className="flex flex-col justify-center items-center bg-white p-10">
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mb-10">
            Please enter your credentials to continue
          </p>

          <div className="w-full max-w-sm flex flex-col gap-6">
            
            <InputBox
              placeholder="Enter Your Email"
              Type="email"
              value={email}
              setValue={setEmail}
              textColor="black"
              borderColor="gray"
            />

            <InputBox
              placeholder="Enter Your Password"
              Type="password"
              value={password}
              setValue={setPassword}
              borderColor="gray"
              textColor="black"
            />

            <div className="mt-4 ml-10">
              <Button
                text="Login"
                ButtonHandler={AdminLoginHandler}
              />
            </div>
          </div>

          <div className="mt-8 text-xs text-gray-400">
            © {new Date().getFullYear()} Admin System. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
