import useSWR, { SWRConfiguration, mutate } from 'swr';
import api from '../utils/axios';

// Custom fetcher for different HTTP methods
const createFetcher = (method: 'GET' | 'POST' | 'PUT' | 'DELETE') => {
  return async (url: string, data?: any) => {
    try {
      let response;
      
      switch (method) {
        case 'GET':
          response = await api.get(url);
          break;
        case 'POST':
          response = await api.post(url, data);
          break;
        case 'PUT':
          response = await api.put(url, data);
          break;
        case 'DELETE':
          response = await api.delete(url);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  };
};

// Hook for GET requests
export const useGet = <T>(
  url: string | null,
  config?: SWRConfiguration
) => {
  return useSWR<T>(url, createFetcher('GET'), config);
};

// Hook for POST requests
export const usePost = <T>(
  url: string | null,
  data?: any,
  config?: SWRConfiguration
) => {
  const fetcher = createFetcher('POST');
  return useSWR<T>(url ? [url, data] : null, ([url, data]) => fetcher(url, data), config);
};

// Hook for PUT requests
export const usePut = <T>(
  url: string | null,
  data?: any,
  config?: SWRConfiguration
) => {
  const fetcher = createFetcher('PUT');
  return useSWR<T>(url ? [url, data] : null, ([url, data]) => fetcher(url, data), config);
};

// Hook for DELETE requests
export const useDelete = <T>(
  url: string | null,
  config?: SWRConfiguration
) => {
  return useSWR<T>(url, createFetcher('DELETE'), config);
};

// Utility function to mutate data
export const mutateData = async (key: string, data?: any) => {
  await mutate(key, data, false);
};

// Utility function to revalidate data
export const revalidateData = async (key: string) => {
  await mutate(key);
};

// Hook for books with automatic revalidation
export const useBooks = () => {
  return useGet('/Book/GetAllBooks', {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // 30 seconds
  });
};

// Hook for a specific book
export const useBook = (id: number | null) => {
  return useGet(id ? `/Book/GetBookById/${id}` : null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
};

// Hook for authors
export const useAuthors = () => {
  return useGet('/Author/GetAllAuthors', {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000,
  });
};

// Hook for users (admin only)
export const useUsers = () => {
  return useGet('/User/GetAllUsers', {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000,
  });
}; 