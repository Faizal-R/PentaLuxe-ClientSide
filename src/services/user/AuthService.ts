import api from "@/config/api";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const AuthService = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.post(USER_API_ROUTES.AUTH.LOGIN, credentials);
      successToast(res.data.message || "Login successful");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Login failed");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  register: async (userData: { email: string; username: string; password: string; phone: string }) => {
    try {
      const res = await api.post(USER_API_ROUTES.AUTH.REGISTER, userData);
      successToast(res.data.message || "Registration successful");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Registration failed");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  verifyOtp: async (otpData: { email: string | undefined; otp: string }) => {
    try {
      const res = await api.post(USER_API_ROUTES.AUTH.VERIFY_OTP, otpData);
      successToast(res.data.message || "Verification successful");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Verification failed");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  resendOtp: async (email: string | undefined) => {
    try {
      const res = await api.post(USER_API_ROUTES.AUTH.RESEND_OTP, { email });
      successToast(res.data.message || "OTP resent successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to resend OTP");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  sendResetOtp: async (email: string) => {
    try {
      const res = await api.post("/user/send-rest-otp", { email });
      successToast(res.data.message || "Reset OTP sent");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to send reset OTP");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  verifyResetOtp: async (otpData: { email: string | undefined; otp: string }) => {
    try {
      const res = await api.post("/user/verfiy-reset-otp", otpData);
      successToast(res.data.message || "OTP verified");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "OTP verification failed");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  resetPassword: async (resetData: { newPassword: string; email: string | undefined }) => {
    try {
      const res = await api.patch("/user/reset-password", resetData);
      successToast(res.data.message || "Password reset successful");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Password reset failed");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  changePassword: async (passwordData: { currentPassword?: string; newPassword: string }) => {
    try {
      const res = await api.patch(USER_API_ROUTES.PROFILE.CHANGE_PASSWORD, passwordData);
      successToast(res.data.message || "Password updated successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to update password");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  googleAuth: async (userData: { email: string | null; username: string | null }) => {
    try {
      const res = await api.post(USER_API_ROUTES.AUTH.GOOGLE_AUTH, userData);
      successToast(res.data.message || "Google authentication successful");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Google authentication failed");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};