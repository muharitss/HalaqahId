export interface GlobalResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export interface GlobalResponseWithPagination<T = unknown> extends GlobalResponse<T> {
  pagination?: import('./pagination').PaginationMeta;
}
