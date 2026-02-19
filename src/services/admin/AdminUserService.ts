import api from "@/config/api";
import { ADMIN_API_ROUTES } from "@/routes/api/AdminApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const AdminUserService = {
  getAllUsers: async () => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.USERS_MANAGEMENT.GET);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch users");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  updateUserStatus: async (userId: string, status: string) => {
    try {
      const res = await api.patch(ADMIN_API_ROUTES.USERS_MANAGEMENT.UPDATE_STATUS, { id: userId, status });
      successToast(res.data.message || "User status updated successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to update user status");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  searchUser: async (text: string) => {
    try {
      const res = await api.post(ADMIN_API_ROUTES.USERS_MANAGEMENT.SEARCH_USER, { text });
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to search users");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};
