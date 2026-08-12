export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
      errors?: {
        message?: string;
      };
    };
  };
}

export const getErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosErrorResponse;

  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  if (err?.response?.data?.error) {
    return err.response.data.error;
  }

  if (err?.response?.data?.errors?.message) {
    return err.response.data.errors.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
