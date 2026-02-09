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
  },
};
