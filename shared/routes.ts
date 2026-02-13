import { z } from 'zod';
import { insertMediaSchema, media } from './schema';

export const api = {
  media: {
    list: {
      method: 'GET' as const,
      path: '/api/media' as const,
      responses: {
        200: z.array(z.custom<typeof media.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/media' as const,
      input: insertMediaSchema,
      responses: {
        201: z.custom<typeof media.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/media/:id' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
    deleteMany: {
      method: 'POST' as const,
      path: '/api/media/delete-many' as const,
      input: z.object({ ids: z.array(z.number()) }),
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
  },
};
