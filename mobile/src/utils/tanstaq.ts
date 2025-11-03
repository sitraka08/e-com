"use client";

import { ApiResponse } from "@/types/api.types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { ToastAndroid } from "react-native";

interface MakeQueryProps<TData> {
  url: string;
  options?: RequestInit;
  retry?: boolean;
  queryKey: (string | number)[];
  initialData?: TData;
  staleTime?: number;
  enabled?: boolean;
}

interface MutationConfig<TData, TResponse = void> {
  queryKey?: string | string[];
  mutationFn: (data: TData) => Promise<ApiResponse<TResponse>>;
  onSuccessCallback?: (res: ApiResponse<TResponse>) => void | Promise<void>;
  onErrorCallback?: (res: ApiResponse<TResponse>) => void;
  invalidateQueries?: boolean;
}

const useCustomQuery = <TData>({
  options,
  url,
  queryKey,
  retry = false,
  enabled = true,
  staleTime,
}: MakeQueryProps<TData>) => {
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData<TData>(queryKey);
  const isHydrated = cachedData !== undefined;

  const query = useQuery<TData>({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await fetch("/api/" + url, options);
      const data = (await response.json()) as ApiResponse<TData>;

      if (!response.ok) {
        const errorMessage = data.message || "Une erreur est survenue";
        const errors = data.error ? ` - ${data.error}` : "";
        throw new Error(`${errorMessage}${errors}`);
      }

      return data.data as TData;
    },
    retry,
    staleTime: isHydrated ? Infinity : (staleTime ?? 0),
    refetchOnMount: !isHydrated,
    refetchOnWindowFocus: false,
    enabled,
    placeholderData: keepPreviousData,
  });

  return query;
};

export const useCustomMutation = <TData, TResponse = void>(
  config: MutationConfig<TData, TResponse>
) => {
  const queryClient = useQueryClient();

  const {
    queryKey,
    mutationFn,
    onSuccessCallback,
    onErrorCallback,
    invalidateQueries = false,
  } = config;

  return useMutation<ApiResponse<TResponse>, ApiResponse<TResponse>, TData>({
    retry: 1,
    mutationFn: async (data) => {
      const res = await mutationFn(data);
      if (!res.success) {
        throw res;
      }
      return res;
    },
    onSuccess: async (res) => {
      if (invalidateQueries) {
        const keys = Array.isArray(queryKey) ? queryKey : [queryKey];
        await queryClient.invalidateQueries({
          queryKey: keys,
          exact: false,
        });
      }

      if (onSuccessCallback) {
        await onSuccessCallback(res);
      }

      const message = res.message || "Opération réussie";

      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    },
    onError: (res) => {
      if (onErrorCallback) {
        onErrorCallback(res as ApiResponse<TResponse>);
      }
      const message = res.message || "Une erreur est survenue";

      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );

      console.error("Mutation Error:", res);
    },
  });
};

interface QueryConfig<TResponse> {
  queryKey: (string | number)[];
  queryFn: () => Promise<ApiResponse<TResponse>>;
  enabled?: boolean;
  staleTime?: number;
  retry?: boolean;
}

export const useSimpleQuery = <TResponse>(
  config: QueryConfig<TResponse>
) => {
  const {
    queryKey,
    queryFn,
    enabled = true,
    staleTime = 0,
    retry = false,
  } = config;

  return useQuery<ApiResponse<TResponse>>({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    retry,
    refetchOnWindowFocus: false,
  });
};

export { useCustomQuery as makeQuery, useCustomMutation as makeMutation };
