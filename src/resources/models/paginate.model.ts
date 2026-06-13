export interface IPagingInfo {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface IPagingResponse<T> {
  data: T[];
  meta?: IPagingInfo;
  loading: boolean;
  error: string;
}