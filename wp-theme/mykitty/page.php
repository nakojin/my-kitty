<?php
/** 일반 페이지 (소개·랭킹 근거 자료 등). */
get_header();
while ( have_posts() ) : the_post(); ?>
<article class="view pad">
	<h1 class="display" style="font-size:26px;margin:6px 0 14px"><?php the_title(); ?></h1>
	<div class="entry-content"><?php the_content(); ?></div>
</article>
<?php endwhile; get_footer(); ?>
