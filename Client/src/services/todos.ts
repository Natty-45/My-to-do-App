import api from './api';
import type { Todo, CreateTodoPayload, UpdateTodoPayload, FilterState } from '../types';

interface TodosResponse {
  message: string;
  count: number;
  data: Todo[];
}

interface TodoResponse {
  message: string;
  data: Todo;
}

export const getAllTodos = async (filters?: Partial<FilterState>): Promise<Todo[]> => {
  const params: Record<string, string> = {};
  if (filters?.status && filters.status !== 'all') params.status = filters.status;
  if (filters?.priority && filters.priority !== 'all') params.priority = filters.priority;
  if (filters?.search) params.search = filters.search;
  if (filters?.sortBy) params.sortBy = filters.sortBy;
  if (filters?.order) params.order = filters.order;
  if (filters?.collectionId && filters.collectionId !== 'all') params.collectionId = filters.collectionId;

  const response = await api.get<TodosResponse>('/to-do', { params });
  return response.data.data;
};

export const getTodo = async (id: string): Promise<Todo> => {
  const response = await api.get<TodoResponse>(`/to-do/${id}`);
  return response.data.data;
};

export const createTodo = async (payload: CreateTodoPayload): Promise<Todo> => {
  const response = await api.post<TodoResponse>('/to-do/create', payload);
  return response.data.data;
};

export const updateTodo = async (id: string, payload: UpdateTodoPayload): Promise<Todo> => {
  const response = await api.put<TodoResponse>(`/to-do/update/${id}`, payload);
  return response.data.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/to-do/delete/${id}`);
};

export const bulkDelete = async (ids: string[]): Promise<void> => {
  await api.delete('/to-do/bulk/delete', { data: { ids } });
};

export const reorderTodos = async (items: { _id: string; order: number }[]): Promise<void> => {
  await api.put('/to-do/reorder', { items });
};
