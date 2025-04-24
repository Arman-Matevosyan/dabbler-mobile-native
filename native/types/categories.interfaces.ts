export interface ICategory {
  id: string;
  name: string;
}

export interface ICategoriesResponse {
  response: ICategory[];
  metadata: Record<string, any>;
}

export interface IContentCheckin {
  id: string;
  venueId: string;
  userId: string;
  timestamp: string;
}

export interface IContentCheckinsResponse {
  response: IContentCheckin[];
  metadata: Record<string, any>;
}

export interface ISearchParams {
  query?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IPaginationMetadata {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
