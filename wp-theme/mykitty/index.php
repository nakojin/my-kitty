<?php
/** 기본 폴백 템플릿 (블로그 글 목록). 1단계에서는 블로그 글만 보여 준다. */
get_header();
?>
<div class="pad">
	<h1 class="display" style="font-size:26px"><?php echo is_home() ? '피규어 추천 글' : get_the_archive_title(); ?></h1>
	<?php if ( have_posts() ) : ?>
		<div style="display:grid;gap:10px;margin-top:14px">
		<?php while ( have_posts() ) : the_post(); ?>
			<a class="panel flat" href="<?php the_permalink(); ?>">
				<div class="t"><?php the_title(); ?></div>
				<div class="muted small"><?php echo esc_html( get_the_excerpt() ); ?></div>
				<div class="muted" style="font-size:11px;margin-top:4px"><?php echo get_the_date(); ?></div>
			</a>
		<?php endwhile; ?>
		</div>
		<?php the_posts_pagination(); ?>
	<?php else : ?>
		<p class="muted">아직 글이 없어요.</p>
	<?php endif; ?>
</div>
<?php get_footer(); ?>
