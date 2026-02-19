import api from "@/config/api";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const WishlistService = {
  getWishlist: async () => {
    try {
      const res = await api.get(USER_API_ROUTES.WISHLIST.GET);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch wishlist");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  addToWishlist: async (wishlistData: { productId?: string; variant?: string | null }) => {
    try {
      const res = await api.post(USER_API_ROUTES.WISHLIST.ADD_TO_WISHLIST, wishlistData);
      successToast(res.data.message || "Added to wishlist");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to add to wishlist");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  removeFromWishlist: async (productId: string) => {
    try {
      const res = await api.delete(USER_API_ROUTES.WISHLIST.REMOVE_FROM_WISHLIST(productId));
      successToast(res.data.message || "Removed from wishlist");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to remove from wishlist");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  checkInWishlist: async (productId: string) => {
    try {
      const res = await api.get(USER_API_ROUTES.WISHLIST.CHECK_PRODUCT(productId));
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to check wishlist status");
      return parsedError;
    }
  }
};
