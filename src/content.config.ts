import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    // 쿠팡 파트너스에서 발급받은 상품 링크
    coupangUrl: z.string().url().optional(),
  }),
});

export const collections = { posts };
