import api from "@/config/api";
import { ADMIN_API_ROUTES } from "@/routes/api/AdminApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const AdminAuthService = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.post(ADMIN_API_ROUTES.AUTH.LOGIN, credentials);
      successToast(res.data.message || "Admin Logged In Successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Admin login failed");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};
