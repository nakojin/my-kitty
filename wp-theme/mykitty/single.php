<?php
/** 블로그 글 (피규어 추천 TOP 5 등). 월드가 연결돼 있으면 월드 테마색 헤더. */
get_header();
while ( have_posts() ) : the_post();
	$terms = get_the_terms( get_the_ID(), 'world' ); $w = $terms && ! is_wp_error( $terms ) ? $terms[0] : null; ?>
<article class="view" style="<?php echo $w ? mykitty_world_style( $w ) : ''; ?>">
	<div class="hero">
		<?php if ( $w ) { mykitty_img_slot( get_term_meta( $w->term_id, 'hero_slot', true ), '', get_the_post_thumbnail_url( null, 'large' ) ?: '', ' ' ); } ?>
		<div class="splat" style="width:110px;height:110px;right:-40px;top:-40px"></div>
		<a href="<?php echo esc_url( $w ? get_term_link( $w ) : get_permalink( get_option( 'page_for_posts' ) ) ); ?>" class="small" style="color:var(--fg);opacity:.8">‹ <?php echo $w ? esc_html( $w->name ) : '글 목록'; ?></a>
		<div class="label" style="color:var(--fg);opacity:.7;margin-top:8px">큐레이션</div>
		<h1 class="display" style="font-size:24px;margin:4px 0 0;line-height:1.1"><?php the_title(); ?></h1>
		<div class="muted small" style="margin-top:10px"><?php echo get_the_date(); ?></div>
	</div>
	<div class="pad entry-content"><?php the_content(); ?></div>
	<?php if ( $w ) : ?>
	<div class="pad" style="padding-top:0">
		<a class="panel" href="<?php echo esc_url( get_term_link( $w ) ); ?>" style="display:flex;justify-content:space-between;align-items:center"><span><span class="label">월드</span><br><span class="t"><?php echo esc_html( $w->name ); ?> 도감 열기</span></span><span class="muted">›</span></a>
	</div>
	<?php endif; ?>
</article>
<?php endwhile; get_footer(); ?>
