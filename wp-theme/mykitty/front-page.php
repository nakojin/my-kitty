<?php
/**
 * 1단계 프론트: 토큰·컴포넌트가 프로토타입과 같게 보이는지 확인하는 "스타일 체크" 페이지.
 * 2단계(월드)·4단계(홈)에서 실제 홈 레이아웃으로 교체한다.
 */
get_header();
$worlds = get_terms( [ 'taxonomy' => 'world', 'hide_empty' => false, 'meta_key' => 'world_no', 'orderby' => 'meta_value_num' ] );
$main   = $worlds && ! is_wp_error( $worlds ) ? $worlds[0] : null;
?>
<div class="hero" style="<?php echo $main ? mykitty_world_style( $main ) : ''; ?>">
	<?php if ( $main ) { mykitty_img_slot( get_term_meta( $main->term_id, 'hero_slot', true ), '', '', ' ' ); } ?>
	<div class="splat" style="width:120px;height:120px;right:-40px;top:-40px"></div>
	<div class="label" style="color:var(--fg);opacity:.7">MY KITTY · 테마 1단계</div>
	<div class="display" style="font-size:34px">스타일<br><span class="brush">체크</span></div>
	<p class="muted small" style="margin:10px 0 0">프로토타입과 같은 토큰·컴포넌트가 로드되는지 확인하는 페이지.</p>
</div>

<div class="pad" style="display:flex;flex-direction:column;gap:16px">

	<section>
		<div class="label" style="margin-bottom:6px">월드 (taxonomy world)</div>
		<div class="grid3">
		<?php foreach ( (array) $worlds as $w ) : if ( is_wp_error( $w ) ) continue; ?>
			<a class="poster wide" href="<?php echo esc_url( get_term_link( $w ) ); ?>" style="<?php echo mykitty_world_style( $w ); ?>">
				<?php mykitty_img_slot( get_term_meta( $w->term_id, 'hero_slot', true ), '', '', ' ' ); ?>
				<span class="cap"><?php echo esc_html( $w->name ); ?><br><span style="color:var(--theme)"><?php echo (int) $w->count; ?>종</span></span>
			</a>
		<?php endforeach; ?>
		</div>
	</section>

	<section>
		<div class="label" style="margin-bottom:6px">칩 · 레어리티</div>
		<div class="chips">
			<?php mykitty_chip( '전체', true ); foreach ( mykitty_rarity_map() as $k => $r ) { mykitty_chip( $r['label'], false, 'r-' . $k ); } ?>
		</div>
	</section>

	<section>
		<div class="label" style="margin-bottom:6px">피규어 (CPT figure) · 최근 6건</div>
		<?php $figs = new WP_Query( [ 'post_type' => 'figure', 'posts_per_page' => 6 ] ); ?>
		<?php if ( $figs->have_posts() ) : ?>
			<div class="grid3"><?php while ( $figs->have_posts() ) : $figs->the_post(); mykitty_figure_card( get_the_ID() ); endwhile; wp_reset_postdata(); ?></div>
		<?php else : ?>
			<div class="panel flat muted small">피규어가 아직 없어요. 관리자 → 피규어 → 추가, 또는 <code>wp-theme/import/</code> 의 CSV를 가져오세요.</div>
		<?php endif; ?>
	</section>

	<section>
		<div class="label" style="margin-bottom:6px">랭킹 행 (CPT ranking_entry) · 신시대 한국 TOP 3</div>
		<?php $rk = new WP_Query( [ 'post_type' => 'ranking_entry', 'posts_per_page' => 3, 'meta_key' => 'rank', 'orderby' => 'meta_value_num', 'order' => 'ASC', 'tax_query' => [ [ 'taxonomy' => 'ranking_board', 'field' => 'slug', 'terms' => 'newera-kr' ] ] ] ); ?>
		<?php if ( $rk->have_posts() ) : while ( $rk->have_posts() ) : $rk->the_post(); mykitty_rank_row( get_the_ID(), true ); endwhile; wp_reset_postdata(); else : ?>
			<div class="panel flat muted small">랭킹 항목이 아직 없어요.</div>
		<?php endif; ?>
	</section>

	<section class="panel">
		<div class="label">쿠팡 CTA · 모든 월드에서 동일</div>
		<div style="display:flex;gap:8px;margin-top:8px">
			<span class="cta sub" style="flex:0 0 118px"><span>♡ 도감 담기</span></span>
			<?php mykitty_coupang_cta( '' ); ?>
		</div>
	</section>

</div>
<?php get_footer(); ?>
