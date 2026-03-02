import api from "@/config/api";
import { ADMIN_API_ROUTES } from "@/routes/api/AdminApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const AdminCouponService = {
  getAllCoupons: async () => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.COUPONS_MANAGEMENT.GET);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch coupons");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  createCoupon: async (couponData: any) => {
    try {
      const res = await api.post(ADMIN_API_ROUTES.COUPONS_MANAGEMENT.CREATE, {
        couponData,
      });
      successToast(res.data.message || "Coupon created successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to create coupon");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  deleteCoupon: async (couponId: string) => {
    try {
      const res = await api.delete(
        ADMIN_API_ROUTES.COUPONS_MANAGEMENT.REMOVE(couponId),
      );
      successToast(res.data.message || "Coupon deleted successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to delete coupon");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  updateCoupon: async (couponId: string, couponData: any) => {
    try {
      const res = await api.put(
        ADMIN_API_ROUTES.COUPONS_MANAGEMENT.UPDATE(couponId),
        { couponData },
      );
      successToast(res.data.message || "Coupon updated successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to update coupon");
      errorToast(parsedError.message);
      return parsedError;
    }
  },
};
