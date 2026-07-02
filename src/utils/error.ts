export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    }
  }
}

export const getErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosErrorResponse;
  
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  
  if (error instanceof Error && error.message) {
    return error.message;
  }
  
  return fallback;
};
