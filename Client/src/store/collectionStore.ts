import { create } from 'zustand';
import type { Collection, CreateCollectionPayload, UpdateCollectionPayload } from '../types';
import * as collectionsService from '../services/collections';

interface CollectionStore {
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  selectedCollectionId: string | 'all' | 'none';

  fetchCollections: () => Promise<void>;
  createCollection: (payload: CreateCollectionPayload) => Promise<Collection>;
  updateCollection: (id: string, payload: UpdateCollectionPayload) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<void>;
  setSelectedCollection: (id: string | 'all' | 'none') => void;
  clearError: () => void;
}

export const useCollectionStore = create<CollectionStore>((set, get) => ({
  collections: [],
  isLoading: false,
  error: null,
  selectedCollectionId: 'all',

  fetchCollections: async () => {
    set({ isLoading: true, error: null });
    try {
      const collections = await collectionsService.getAllCollections();
      set({ collections, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch collections.',
        isLoading: false,
      });
    }
  },

  createCollection: async (payload: CreateCollectionPayload) => {
    const collection = await collectionsService.createCollection(payload);
    set((state) => ({ collections: [collection, ...state.collections] }));
    return collection;
  },

  updateCollection: async (id: string, payload: UpdateCollectionPayload) => {
    const updated = await collectionsService.updateCollection(id, payload);
    set((state) => ({
      collections: state.collections.map((c) => (c._id === id ? updated : c)),
    }));
    return updated;
  },

  deleteCollection: async (id: string) => {
    await collectionsService.deleteCollection(id);
    set((state) => ({
      collections: state.collections.filter((c) => c._id !== id),
    }));
  },

  setSelectedCollection: (id: string | 'all' | 'none') => {
    set({ selectedCollectionId: id });
  },

  clearError: () => set({ error: null }),
}));
