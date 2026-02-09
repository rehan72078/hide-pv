import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertMedia } from "@shared/routes";

export function useMedia() {
  return useQuery({
    queryKey: [api.media.list.path],
    queryFn: async () => {
      const res = await fetch(api.media.list.path);
      if (!res.ok) throw new Error("Failed to fetch media");
      return api.media.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMedia) => {
      const res = await fetch(api.media.create.path, {
        method: api.media.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create media");
      return api.media.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.media.list.path] });
    },
  });
}
