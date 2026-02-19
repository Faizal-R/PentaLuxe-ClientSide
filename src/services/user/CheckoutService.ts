import api from "@/config/api";    
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const CheckoutService = {
  getCoupons: async () => {
    try {
      const res = await api.get(USER_API_ROUTES.COUPONS.GET);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch coupons");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  getRazorpayKey: async () => {
    try {
      const res = await api.get(USER_API_ROUTES.PAYMENT.GET_RAZORPAY_KEY);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch payment key");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  createRazorpayOrder: async (totalPrice: number) => {
    try {
      const res = await api.post(USER_API_ROUTES.PAYMENT.CREATE_RAZORPAY_ORDER, { totalPrice });
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to create payment order");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  verifyAndCreateOrder: async (paymentData: Record<string, unknown>) => {
    try {
      const res = await api.post(USER_API_ROUTES.PAYMENT.VERIFY_AND_CREATE_ORDER, paymentData);
      successToast(res.data.message || "Payment verified and order created");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Payment verification failed");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  handlePaymentFailure: async (failureData: Record<string, unknown>) => {
    try {
      const res = await api.post(USER_API_ROUTES.PAYMENT.PAYMENT_FAILURE, failureData);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to record payment failure");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  walletPayment: async (paymentData: Record<string, unknown>) => {
    try {
      const res = await api.post(USER_API_ROUTES.PAYMENT.WALLET_PAYMENT, paymentData);
      successToast(res.data.message || "Payment successful via wallet");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Wallet payment failed");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  retryPayment: async (retryData: Record<string, unknown>) => {
    try {
      const res = await api.put(USER_API_ROUTES.PAYMENT.RETRY_PAYMENT, retryData);
      successToast(res.data.message || "Payment verified and status updated");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to retry payment");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};
