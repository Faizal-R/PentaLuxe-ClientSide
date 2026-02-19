import api from "@/config/api";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast } from "@/utils/customToast";

export const ProductService = {
  getProducts: async (params?: Record<string, string | number | boolean | undefined>) => {
    try {
      const res = await api.get(USER_API_ROUTES.PRODUCTS.GET, { params });
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch products");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  getProductById: async (productId: string) => {
    try {
      const res = await api.get(USER_API_ROUTES.PRODUCTS.GET_BY_ID(productId));
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch product details");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  getRelatedProducts: async (params?: Record<string, string | number | boolean | undefined>) => {
    try {
      const res = await api.get(USER_API_ROUTES.PRODUCTS.GET_RELATED_PRODUCTS, { params });
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch related products");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  searchByCategory: async (params?: Record<string, string | number | boolean | undefined>) => {
    try {
      const res = await api.get(USER_API_ROUTES.PRODUCTS.SEARCH_BY_CATEGORY, { params });
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to search products by category");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  getCategories: async () => {
    try {
      const res = await api.get(USER_API_ROUTES.CATEGORIES.GET);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch categories");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  getProductsByCategory: async (categoryId: string) => {
    try {
      const res = await api.get(USER_API_ROUTES.CATEGORIES.GET_ALL_PRODUCTS_BY_CATEGORY(categoryId));
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch products for this category");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};
