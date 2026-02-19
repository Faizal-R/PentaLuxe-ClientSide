import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "./Config";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { LogIn } from "@/store/slices/userSlice";


type GoogleAuthProps = {
  text: string;
};
import { AuthService } from "@/services/user/AuthService";

const GoogleAuth: React.FC<GoogleAuthProps> = ({ text }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = () => {
    signInWithPopup(auth, provider).then(async (data) => {
      if (data.user) {
        const res = await AuthService.googleAuth({
          username: data.user.displayName,
          email: data.user.email,
        });

        if (res.success) {
          dispatch(LogIn());
          localStorage.setItem("accessToken", res.data.accessToken);
          navigate("/");
        }
      }
    });
  };

  return (
    <div>
    
      <button
        className="flex items-center font-gilroy font-extrabold bg-white text-black rounded-xl px-6 gap-3"
        onClick={handleSignIn}
      >
        <img
          className="w-12 h-12 object-cover"
          src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
          alt="Google Logo"
        />
        {text}
      </button>
    </div>
  );
};

export default GoogleAuth;
