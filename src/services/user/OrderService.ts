import api from "@/config/api";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const OrderService = {
  getOrders: async () => {
    try {
      const res = await api.get(USER_API_ROUTES.ORDERS.GET);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch orders");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  placeOrder: async (orderData: Record<string, unknown>) => {
    try {
      const res = await api.post(USER_API_ROUTES.ORDERS.PLACE_ORDER, orderData);
      successToast(res.data.message || "Order placed successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to place order");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  cancelOrReturnOrder: async (orderData: { id: string; reason: string; type: string; payment: string }) => {
    try {
      const res = await api.patch(USER_API_ROUTES.ORDERS.CANCEL_OR_RETURN_ORDER, orderData);
      successToast(res.data.message || "Order status updated successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to update order status");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};
