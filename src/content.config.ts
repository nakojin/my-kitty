import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    // 글에서 추천하는 상품 목록. coupangUrl은 파트너스 링크 발급 후 채웁니다.
    products: z
      .array(
        z.object({
          name: z.string(),
          price: z.string().optional(),
          note: z.string().optional(),
          coupangUrl: z.string().url().optional(),
        }),
      )
      .default([]),
  }),
});

export const collections = { posts };
