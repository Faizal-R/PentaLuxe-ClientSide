import api from "@/config/api";
import { ADMIN_API_ROUTES } from "@/routes/api/AdminApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const AdminProductService = {
  getAllProducts: async () => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.PRODUCTS_MANAGEMENT.GET_ALL);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch products");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  deleteProduct: async (productId: string) => {
    try {
      const res = await api.delete(ADMIN_API_ROUTES.PRODUCTS_MANAGEMENT.DELETE_PRODUCT(productId));
      successToast(res.data.message || "Product deleted successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to delete product");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  searchProducts: async (text: string) => {
    try {
      const res = await api.post(ADMIN_API_ROUTES.PRODUCTS_MANAGEMENT.SEARCH_PRODUCTS, { text });
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to search products");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  addProduct: async (productData: FormData) => {
    try {
      const res = await api.post(ADMIN_API_ROUTES.PRODUCTS_MANAGEMENT.CREATE_PRODUCT, productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      successToast(res.data.message || "Product added successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to add product");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  updateProduct: async (productId: string, productData: FormData) => {
    try {
      const res = await api.put(ADMIN_API_ROUTES.PRODUCTS_MANAGEMENT.UPDATE_PRODUCT(productId), productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      successToast(res.data.message || "Product updated successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to update product");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  getProductById: async (productId: string) => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.PRODUCTS_MANAGEMENT.GET_BY_ID(productId));
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch product details");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};
