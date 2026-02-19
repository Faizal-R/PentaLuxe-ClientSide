import api from "@/config/api";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast, successToast } from "@/utils/customToast";

export const ProfileService = {
  getProfile: async () => {
    try {
      const res = await api.get(USER_API_ROUTES.PROFILE.GET);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch profile");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      const res = await api.put(USER_API_ROUTES.PROFILE.UPDATE, profileData);
      successToast(res.data.message || "Profile updated successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to update profile");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  getAddressBook: async () => {
    try {
      const res = await api.get(USER_API_ROUTES.ADDRESS_BOOK.GET);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch address book");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  addAddress: async (addressData: any) => {
    try {
      const res = await api.post(USER_API_ROUTES.ADDRESS_BOOK.ADD_ADDRESS_BOOK, addressData);
      successToast(res.data.message || "Address added successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to add address");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  updateAddress: async (addressData: any) => {
    try {
      const res = await api.put(USER_API_ROUTES.ADDRESS_BOOK.UPDATE_ADDRESS_BOOK, addressData);
      successToast(res.data.message || "Address updated successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to update address");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  deleteAddress: async (addressBookId: string) => {
    try {
      const res = await api.delete(USER_API_ROUTES.ADDRESS_BOOK.DELETE_ADDRESS_BOOK(addressBookId));
      successToast(res.data.message || "Address deleted successfully");
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to delete address");
      errorToast(parsedError.message);
      return parsedError;
    }
  },

  getAddressById: async (addressBookId: string) => {
    try {
      const res = await api.get(USER_API_ROUTES.ADDRESS_BOOK.GET_BY_ID(addressBookId));
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch address");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};
