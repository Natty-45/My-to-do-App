export interface Todo {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

export interface AuthResponse {
  authenticated: boolean;
  userId: string;
}
