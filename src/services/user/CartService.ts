import api from "@/config/api";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const CartService = {
  getCart: async () => {
    try {
      const res = await api.get(USER_API_ROUTES.CART.GET);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch cart");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  addToCart: async (cartData: { productId?: string; volume?: string | null; stock?: number }) => {
    console.log("cartData", cartData)
    try {
      const res = await api.post(USER_API_ROUTES.CART.ADD_TO_CART, cartData);
      successToast(res.data.message || "Added to cart");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to add to cart");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  updateQuantity: async (itemId: string, action: string, stock: number) => {
    try {
      const res = await api.patch(USER_API_ROUTES.CART.PATCH, { itemId, action, stock });
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to update quantity");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  removeFromCart: async (productId: string) => {
    try {
      const res = await api.delete(USER_API_ROUTES.CART.REMOVE_PRODUCT(productId));
      successToast(res.data.message || "Removed from cart");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to remove product from cart");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  setCartTotal: async (totalPrice: number) => {
    try {
      const res = await api.patch(USER_API_ROUTES.CART.CART_TOTAL, { totalPrice });
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to set cart total");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};
