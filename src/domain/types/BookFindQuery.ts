import { Pagination } from './Pagination';

export interface bookFindQuery extends Pagination {
  author?: string;
  title?: string;
}
