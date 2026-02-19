import api from "@/config/api";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";
import { parseAxiosError } from "@/utils/parseAxiosError";
import { errorToast } from "@/utils/customToast";

export const WalletService = {
  getWallet: async () => {
    try {
      const res = await api.get(USER_API_ROUTES.WALLET.GET);
      return res.data;
    } catch (error) {
      const parsedError = parseAxiosError(error, "Failed to fetch wallet information");
      errorToast(parsedError.message);
      return parsedError;
    }
  }
};
