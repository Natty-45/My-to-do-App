import api from './api';
import type { Collection, CreateCollectionPayload, UpdateCollectionPayload } from '../types';

interface CollectionsResponse {
  message: string;
  count: number;
  data: Collection[];
}

interface CollectionResponse {
  message: string;
  data: Collection;
}

export const getAllCollections = async (): Promise<Collection[]> => {
  const response = await api.get<CollectionsResponse>('/collections');
  return response.data.data;
};

export const getCollection = async (id: string): Promise<Collection> => {
  const response = await api.get<CollectionResponse>(`/collections/${id}`);
  return response.data.data;
};

export const createCollection = async (payload: CreateCollectionPayload): Promise<Collection> => {
  const response = await api.post<CollectionResponse>('/collections/create', payload);
  return response.data.data;
};

export const updateCollection = async (id: string, payload: UpdateCollectionPayload): Promise<Collection> => {
  const response = await api.put<CollectionResponse>(`/collections/update/${id}`, payload);
  return response.data.data;
};

export const deleteCollection = async (id: string): Promise<void> => {
  await api.delete(`/collections/delete/${id}`);
};
