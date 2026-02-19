export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    }
  }
}

export const getErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosErrorResponse;
  return err.response?.data?.message || fallback;
};
