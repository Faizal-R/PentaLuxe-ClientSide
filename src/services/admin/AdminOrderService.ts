import api from "@/config/api";
import { ADMIN_API_ROUTES } from "@/routes/api/AdminApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const AdminOrderService = {
  getAllOrders: async () => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.ORDERS_MANAGEMENT.GET_ALL);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch orders");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      const res = await api.patch(ADMIN_API_ROUTES.ORDERS_MANAGEMENT.HANDLE_ORDER_STATUS, { orderId, status });
      successToast(res.data.message || "Order status updated successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to update order status");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};
