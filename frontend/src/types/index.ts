export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface Remedy {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  category: string;
  author_id: string;
  author_name?: string;
  status: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  board_id: string;
  author_id: string;
  author_name?: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
