export class PaginationResponse<T> {
  page: number;
  perPage: number;
  count: number;
  data: T[];
}
