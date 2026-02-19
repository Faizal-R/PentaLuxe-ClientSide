// src/utils/parseAxiosError.ts
import { AxiosError, isAxiosError } from "axios";

export const parseAxiosError = (
  error: AxiosError | Error | unknown,
  defaultMessage: string,
) => {
  if (isAxiosError(error)) {
    return {
      success: false,
      message: error.response?.data?.message || defaultMessage,
      error: true,
    };
  }

  return {
    success: false,
    message: "Unexpected error occurred",
  };
};
