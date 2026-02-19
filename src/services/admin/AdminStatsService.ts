import api from "@/config/api";
import { ADMIN_API_ROUTES } from "@/routes/api/AdminApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast } from "@/utils/customToast";

export const AdminStatsService = {
  getDashboardStats: async (filter: string) => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.DASHBOARD.GET(filter));
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch dashboard stats");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  getBestSellingProducts: async () => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.DASHBOARD.BEST_SELLING_PRODUCTS);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch best selling products");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  getBestSellingCategories: async () => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.DASHBOARD.BEST_SELLING_CATEGORIES);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch best selling categories");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  generateSalesReport: async (payload: Record<string, unknown>) => {
    try {
      const res = await api.post(ADMIN_API_ROUTES.SALES_REPORT.GENERATE, payload);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to generate sales report");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};
