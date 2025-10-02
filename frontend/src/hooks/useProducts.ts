import { useQuery } from '@tanstack/react-query';
import { api, FrontendProduct } from '../services/api';

export const useProducts = () => {
  return useQuery<FrontendProduct[], Error>({
    queryKey: ['products'],
    queryFn: api.getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useProduct = (id: string) => {
  return useQuery<FrontendProduct | null, Error>({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
