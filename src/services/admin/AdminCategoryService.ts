import api from "@/config/api";
import { ADMIN_API_ROUTES } from "@/routes/api/AdminApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const AdminCategoryService = {
  getAllCategories: async () => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.CATEGORIES_MANAGEMENT.GET);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch categories");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  addCategory: async (formData: FormData) => {
    try {
      const res = await api.post(ADMIN_API_ROUTES.CATEGORIES_MANAGEMENT.UPLOAD_CATEGORY, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      successToast(res.data.message || "Category added successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to add category");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  updateCategory: async (formData: FormData) => {
    try {
      const res = await api.put(ADMIN_API_ROUTES.CATEGORIES_MANAGEMENT.EDIT_CATEGORY, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      successToast(res.data.message || "Category updated successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to update category");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  deleteCategory: async (categoryId: string) => {
    try {
      const res = await api.delete(ADMIN_API_ROUTES.CATEGORIES_MANAGEMENT.DELETE_CATEGORY(categoryId));
      successToast(res.data.message || "Category deleted successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to delete category");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};
