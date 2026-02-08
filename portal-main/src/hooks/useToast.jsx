import React from "react";
import axios from "axios";
import { toast } from "sonner";

const useToast = () => {
  const showInfo = (message) => {
    toast.info(message);
  };

  const showSuccess = (message) => {
    toast.success(message);
  };

  const showError = (error) => {
    if (axios.isAxiosError(error)) {
      toast.error(error.response.data.message);
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(error);
    }
  };

  const showWarning = (message) => {
    toast.warning(message);
  };

  return { showInfo, showSuccess, showError, showWarning };
};

export default useToast;
