export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Remedy {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  category: string;
  tags: string[];
  author_id: number;
  status: string;
  views: number;
  likes: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: number;
  user_id: number;
  remedy_id?: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  category: string;
  tags: string[];
  status: string;
  admin_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: number;
}

export interface Board {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
