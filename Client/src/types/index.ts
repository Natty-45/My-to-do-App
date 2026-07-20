export type TodoStatus = 'pending' | 'in-progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoPayload {
  title: string;
  description: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string;
  category?: string;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string | null;
  category?: string;
}

export interface FilterState {
  status: TodoStatus | 'all';
  priority: TodoPriority | 'all';
  search: string;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title';
  order: 'asc' | 'desc';
}

export interface AuthResponse {
  authenticated: boolean;
  userId: string;
  token: string;
}
