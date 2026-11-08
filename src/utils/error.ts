export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string | string[] | Record<string, unknown>;
      error?: string | Record<string, unknown>;
      errors?: {
        message?: string;
      } | Array<{ message?: string }>;
    };
  };
}

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!error) return fallback;

  if (typeof error === "string") return error;

  const err = error as AxiosErrorResponse;
  const data = err?.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data && typeof data === "object") {
    if (typeof data.message === "string") {
      return data.message;
    }
    if (Array.isArray(data.message) && data.message.length > 0) {
      return data.message.map(String).join(", ");
    }
    if (typeof data.error === "string") {
      return data.error;
    }
    if (
      typeof data.error === "object" &&
      data.error !== null &&
      "message" in data.error &&
      typeof (data.error as { message?: unknown }).message === "string"
    ) {
      return (data.error as { message: string }).message;
    }
    if (
      data.errors &&
      typeof data.errors === "object" &&
      "message" in data.errors &&
      typeof (data.errors as { message?: unknown }).message === "string"
    ) {
      return (data.errors as { message: string }).message;
    }
  }

  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }

  return fallback;
};

