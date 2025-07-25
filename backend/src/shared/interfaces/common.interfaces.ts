// Common interfaces used across modules
export interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
}

export interface IPaginationOptions {
  page: number;
  limit: number;
  skip?: number;
}

export interface IPaginationResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Database query options
export interface IQueryOptions {
  relations?: string[];
  select?: string[];
  where?: any;
  order?: any;
}

// File upload interface
export interface IFileUpload {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  url?: string;
}
