<?php
/**
 * 랭킹 (S6). /ranking/newera-kr/ … /ranking/legend/?decade=90s
 * 신시대 보드 4개는 서로 지역 칩으로 이동, 레전드는 연대 필터.
 */
get_header();
$board  = get_queried_object();
$is_new = str_starts_with( $board->slug, 'newera-' );
$decade = sanitize_key( $_GET['decade'] ?? '' );
$regions = [ 'kr' => [ '한국', '극장 관객수 · 라프텔 · 쿠팡 피규어관' ], 'jp' => [ '일본', '흥행수입 · ABEMA · Filmarks · Animate Times' ], 'cn' => [ '중국', 'Bilibili · iQIYI 재생수 (국산 동화 포함)' ], 'asia' => [ '아시아', 'Netflix · Crunchyroll Anime Awards' ] ];
$region  = $is_new ? substr( $board->slug, 7 ) : '';
$args    = [ 'post_type' => 'ranking_entry', 'posts_per_page' => -1, 'meta_key' => 'rank', 'orderby' => 'meta_value_num', 'order' => 'ASC',
	'tax_query' => [ [ 'taxonomy' => 'ranking_board', 'field' => 'term_id', 'terms' => $board->term_id ] ] ];
if ( ! $is_new && $decade ) { $args['meta_query'] = [ [ 'key' => 'decade', 'value' => $decade ] ]; }
$entries = get_posts( $args );
$theme   = $is_new ? '--theme:#2fd36f;--theme2:#ff7a1a;--on-theme:#000;--g:35%' : '--theme:#ffcc33;--theme2:#f2f0ea;--on-theme:#000;--g:30%';
$legend_url = get_term_link( 'legend', 'ranking_board' );
?>
<div class="view" data-screen="ranking" style="<?php echo $theme; ?>">
	<div class="hero" style="padding-bottom:0">
		<?php mykitty_img_slot( $is_new ? 'IMG-RANK-NEWERA' : 'IMG-RANK-LEGEND', '', '', ' ' ); ?>
		<div class="splat" style="width:120px;height:120px;right:-44px;top:-44px"></div>
		<nav class="segtabs" style="margin:0;padding:0;border:0">
			<a class="<?php echo $is_new ? 'on' : ''; ?>" href="<?php echo esc_url( get_term_link( 'newera-kr', 'ranking_board' ) ); ?>" style="font-size:15px">신시대</a>
			<a class="<?php echo $is_new ? '' : 'on'; ?>" href="<?php echo esc_url( $legend_url ); ?>" style="font-size:15px">레전드</a>
		</nav>
		<h1 class="display" style="font-size:34px;margin:12px 0 0"><?php echo $is_new ? '신시대' : '레전드'; ?> <span class="brush" style="font-size:18px">TOP <?php echo $is_new ? 20 : 30; ?></span></h1>
		<div class="muted small" style="margin:8px 0 12px"><?php echo $is_new ? '2020 → 2026 · 지금 가장 뜨거운 작품' : '1980 → 지금까지 사랑받는 명작 30'; ?></div>
	</div>

	<div class="pad" style="display:flex;flex-direction:column;gap:10px">
		<div class="chips">
			<?php if ( $is_new ) : foreach ( $regions as $k => [ $label ] ) { mykitty_chip( $label, $k === $region, '', get_term_link( 'newera-' . $k, 'ranking_board' ) ); }
			else : foreach ( [ '' => '전체', '80s' => '1980s', '90s' => '1990s', '00s' => '2000s', '10s' => '2010s' ] as $k => $label ) { mykitty_chip( $label, $decade === $k, '', $k ? add_query_arg( 'decade', $k, $legend_url ) : $legend_url ); }
			endif; ?>
		</div>
		<div class="muted" style="font-size:11px">
			<?php echo $is_new ? '근거: ' . esc_html( $regions[ $region ][1] ?? '' ) . ' · 편집부 선정' : '1980년대부터 지금까지 꾸준히 사랑받는 작품 · 편집부 선정'; ?>
			· <a href="<?php echo esc_url( home_url( '/ranking-sources/' ) ); ?>" style="color:var(--theme)">출처</a>
		</div>

		<?php if ( $entries ) : ?>
			<div><?php foreach ( $entries as $p ) { mykitty_rank_row( $p->ID ); } ?></div>
		<?php else : ?>
			<div class="panel flat muted small">이 보드에 항목이 없어요. <code>wp eval-file wp-theme/import/import.php</code> 로 가져오세요.</div>
		<?php endif; ?>

		<div class="panel flat muted" style="font-size:11px">막대 3칸 = 피규어 시장 규모(많음·보통·적음). "월드 ›"가 있는 작품은 피규어 도감이 열려 있어요.</div>
	</div>
</div>
<?php get_footer(); ?>
