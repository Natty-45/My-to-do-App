import { create } from 'zustand';
import type { Todo, FilterState, CreateTodoPayload, UpdateTodoPayload } from '../types';
import * as todosService from '../services/todos';

interface TodoStore {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  filters: FilterState;

  // Actions
  fetchTodos: () => Promise<void>;
  createTodo: (payload: CreateTodoPayload) => Promise<Todo>;
  updateTodo: (id: string, payload: UpdateTodoPayload) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  setFilter: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  clearError: () => void;
}

const defaultFilters: FilterState = {
  status: 'all',
  priority: 'all',
  search: '',
  sortBy: 'createdAt',
  order: 'desc',
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,
  filters: defaultFilters,

  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const todos = await todosService.getAllTodos(filters);
      set({ todos, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch todos.',
        isLoading: false,
      });
    }
  },

  createTodo: async (payload: CreateTodoPayload) => {
    const todo = await todosService.createTodo(payload);
    set((state) => ({ todos: [todo, ...state.todos] }));
    return todo;
  },

  updateTodo: async (id: string, payload: UpdateTodoPayload) => {
    const updated = await todosService.updateTodo(id, payload);
    set((state) => ({
      todos: state.todos.map((t) => (t._id === id ? updated : t)),
    }));
    return updated;
  },

  deleteTodo: async (id: string) => {
    await todosService.deleteTodo(id);
    set((state) => ({ todos: state.todos.filter((t) => t._id !== id) }));
  },

  bulkDelete: async (ids: string[]) => {
    await todosService.bulkDelete(ids);
    set((state) => ({ todos: state.todos.filter((t) => !ids.includes(t._id)) }));
  },

  setFilter: (newFilters: Partial<FilterState>) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  clearError: () => set({ error: null }),
}));
