import { defineConfig } from 'astro/config';

// GitHub Pages: https://nakojin.github.io/my-kitty/
// 커스텀 도메인을 연결하면 site를 바꾸고 base를 지우세요.
export default defineConfig({
  site: 'https://nakojin.github.io',
  base: '/my-kitty',
});
