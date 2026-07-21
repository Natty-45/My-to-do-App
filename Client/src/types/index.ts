export type TodoStatus = 'pending' | 'in-progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  text: string;
  completed: boolean;
}

export interface Recurring {
  interval: 'daily' | 'weekly' | 'monthly' | 'none';
  nextDate?: string;
}

export interface Todo {
  _id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  category?: string;
  tags: string[];
  subtasks: Subtask[];
  recurring: Recurring;
  collectionId?: string;
  order: number;
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
  tags?: string[];
  subtasks?: Subtask[];
  recurring?: Recurring;
  collectionId?: string;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string | null;
  category?: string;
  tags?: string[];
  subtasks?: Subtask[];
  recurring?: Recurring;
  collectionId?: string | null;
  order?: number;
}

export interface FilterState {
  status: TodoStatus | 'all';
  priority: TodoPriority | 'all';
  search: string;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title';
  order: 'asc' | 'desc';
  collectionId: string | 'all' | 'none';
}

export interface AuthResponse {
  authenticated: boolean;
  userId: string;
  token: string;
}

export interface Collection {
  _id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  todoCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionPayload {
  name: string;
  color?: string;
  icon?: string;
  description?: string;
}

export interface UpdateCollectionPayload {
  name?: string;
  color?: string;
  icon?: string;
  description?: string;
}

export interface AIGeneratedTodo {
  title: string;
  description: string;
  priority: TodoPriority;
  category: string;
  tags: string[];
}
