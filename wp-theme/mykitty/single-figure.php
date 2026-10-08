<?php
/**
 * 피규어 단일 페이지 (S4).
 *  - 직접 접근: 전체 페이지(헤더·탭바 포함).
 *  - ?partial=1 : 시트에 끼울 본문만 출력 (assets/js/app.js 가 fetch).
 */
if ( ! empty( $_GET['partial'] ) ) {
	while ( have_posts() ) { the_post(); get_template_part( 'template-parts/figure-detail', null, [ 'id' => get_the_ID() ] ); }
	return;
}
get_header();
while ( have_posts() ) : the_post(); $w = mykitty_figure_world( get_the_ID() ); ?>
<div class="view single-figure" style="display:flex;flex-direction:column;min-height:100%">
	<div class="pad" style="padding-bottom:0;display:flex;justify-content:space-between;align-items:center">
		<a href="<?php echo esc_url( $w ? mykitty_term_url( $w ) : home_url( '/' ) ); ?>" class="small muted"><?php echo mykitty_icon( 'chevron-left' ); ?><?php echo $w ? esc_html( $w->name ) : '홈'; ?></a>
		<a href="#" class="small muted" data-share-url="<?php the_permalink(); ?>"><?php echo mykitty_icon( 'share-2' ); ?>공유</a>
	</div>
	<?php get_template_part( 'template-parts/figure-detail', null, [ 'id' => get_the_ID() ] ); ?>
</div>
<?php endwhile; get_footer(); ?>
