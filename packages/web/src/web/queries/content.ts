import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '../lib/api';
export type ContentRow = { id: string; kind: string; data: Record<string,string> };
export function useContent() { return useQuery(orpc.contents.list.queryOptions({ staleTime: 30000 })); }
export function useAccess(enabled: boolean) { return useQuery(orpc.contents.access.queryOptions({ enabled, retry: false })); }
export function useSave() { const q = useQueryClient(); return useMutation(orpc.contents.save.mutationOptions({ onSuccess: () => q.invalidateQueries({ queryKey: orpc.contents.key() }) })); }
export function useRemove() { const q = useQueryClient(); return useMutation(orpc.contents.remove.mutationOptions({ onSuccess: () => q.invalidateQueries({ queryKey: orpc.contents.key() }) })); }