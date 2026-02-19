

import { toast } from 'sonner';
export const successToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
   className: "custom-success-toast",
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    duration: 3000,
    className: "custom-error-toast",
  });
};

export const infoToast = (message: string) => {
  toast(message, {
    duration: 3000,
    style: {
      background: "#3b82f6", // blue
      color: "white",
      borderRadius: "8px",
      fontSize: "14px",
    },
  });
};
