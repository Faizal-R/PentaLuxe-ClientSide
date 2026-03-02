import api from "@/config/api";
import { ADMIN_API_ROUTES } from "@/routes/api/AdminApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const AdminOfferService = {
  getAllOffers: async () => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.OFFERS_MANAGEMENT.GET_ALL);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch offers");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  updateProductOffer: async (offerData: Record<string, unknown>) => {
    try {
      const res = await api.patch(
        ADMIN_API_ROUTES.OFFERS_MANAGEMENT.UPDATE_PRODUCT_OFFER,
        offerData,
      );
      successToast(res.data.message || "Product offer updated successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(
        error,
        "Failed to update product offer",
      );
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  updateCategoryOffer: async (offerData: Record<string, unknown>) => {
    try {
      const res = await api.patch(
        ADMIN_API_ROUTES.OFFERS_MANAGEMENT.UPDATE_CATEGORY_OFFER,
        offerData,
      );
      successToast(res.data.message || "Category offer updated successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(
        error,
        "Failed to update category offer",
      );
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  deleteOffer: async (offerId: string) => {
    try {
      const res = await api.delete(
        ADMIN_API_ROUTES.OFFERS_MANAGEMENT.REMOVE(offerId),
      );
      successToast(res.data.message || "Offer deleted successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to delete offer");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  editOffer: async (offerId: string, DiscountPercentage: number) => {
    try {
      const res = await api.put(
        ADMIN_API_ROUTES.OFFERS_MANAGEMENT.UPDATE(offerId),
        { DiscountPercentage },
      );
      successToast(res.data.message || "Offer updated successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to update offer");
      errorToast(parsedError.message);
      return parsedError;
    }
  },
};
