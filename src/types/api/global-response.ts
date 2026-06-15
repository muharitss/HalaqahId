export interface GlobalResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export interface GlobalResponseWithPagination<T = any> extends GlobalResponse<T> {
  pagination?: import('./pagination').PaginationMeta;
}
