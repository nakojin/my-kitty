<?php
/**
 * 홈 (S2). 서버: 신시대 TOP 3, 재입고·신상 피드, 월드 데이터. 클라이언트(app.js): 체크인·레벨·뽑기·내 월드 타일.
 * 온보딩 전 사용자는 app.js 가 /onboarding/ 으로 보낸다.
 */
get_header();
$feed = get_posts( [ 'post_type' => 'figure', 'posts_per_page' => 3, 'meta_key' => 'rarity', 'meta_value' => 'rare', 'orderby' => 'date', 'order' => 'DESC' ] );
$top3 = get_posts( [ 'post_type' => 'ranking_entry', 'posts_per_page' => 3, 'meta_key' => 'rank', 'orderby' => 'meta_value_num', 'order' => 'ASC',
	'tax_query' => [ [ 'taxonomy' => 'ranking_board', 'field' => 'slug', 'terms' => 'newera-kr' ] ] ] );
$days = [ '월', '화', '수', '목', '금', '토', '일' ];
?>
<div class="view" data-screen="home">
	<div class="hero" data-main-world>
		<div class="img-slot" data-hero-slot style="position:absolute;inset:0;border:0;color:transparent;opacity:.35"></div>
		<div class="splat" style="width:120px;height:120px;right:-40px;top:-40px"></div>
		<div class="splat ink" style="width:8px;height:8px;right:84px;top:30px"></div>
		<div style="display:flex;justify-content:space-between;align-items:flex-end">
			<div><div class="label" style="color:var(--fg);opacity:.7">🔥 연속 체크인</div><div class="display" style="font-size:34px"><span data-streak>0</span>일째</div></div>
			<div style="text-align:right"><div class="label" style="color:var(--fg);opacity:.7">LEVEL</div><div class="display" style="font-size:26px;color:var(--theme)" data-level>1</div></div>
		</div>
		<div class="chips" style="margin-top:10px" data-days>
			<?php foreach ( $days as $i => $d ) : ?><span class="chip" data-day="<?php echo $i; ?>"><span><?php echo $d; ?></span></span><?php endforeach; ?>
			<button type="button" class="chip on" data-checkin><span>체크인 +10XP</span></button>
		</div>
	</div>

	<div class="pad" style="display:flex;flex-direction:column;gap:14px">

		<div class="panel" style="display:flex;gap:14px;align-items:center;padding:14px" data-gacha-panel>
			<div class="gacha idle" data-gacha style="width:92px;height:122px;flex:none">
				<div class="card"><div class="face front">?</div><div class="face back" data-gacha-back></div></div>
			</div>
			<div style="flex:1;min-width:0" data-gacha-text>
				<div class="label">오늘의 뽑기 · 1/1</div>
				<div class="t" style="font-size:15px;margin:2px 0 8px">오늘의 추천 피규어가<br>기다리고 있어</div>
				<button type="button" class="cta theme" data-gacha-go style="width:auto;padding:8px 16px;font-size:12px"><span>탭해서 공개</span></button>
			</div>
		</div>

		<section>
			<div class="label" style="margin-bottom:6px">내 월드</div>
			<div class="grid3" data-my-worlds></div>
		</section>

		<?php if ( $top3 ) : ?>
		<section>
			<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px"><div class="label">신시대 랭킹</div><a class="small" style="color:var(--theme)" href="<?php echo esc_url( get_term_link( 'newera-kr', 'ranking_board' ) ); ?>">전체 ›</a></div>
			<?php foreach ( $top3 as $p ) { mykitty_rank_row( $p->ID, true ); } ?>
		</section>
		<?php endif; ?>

		<?php if ( $feed ) : ?>
		<section>
			<div class="label" style="margin-bottom:4px">재입고 · 신상</div>
			<?php foreach ( $feed as $i => $p ) : $slug = $p->post_name; $r = mykitty_rarity_map()[ get_post_meta( $p->ID, 'rarity', true ) ?: 'common' ]; ?>
			<a class="row" href="<?php echo esc_url( get_permalink( $p ) ); ?>" data-sheet>
				<div class="thumb"><?php mykitty_img_slot( 'COUPANG-' . $slug, 'product', get_post_meta( $p->ID, 'product_image', true ), ' ' ); ?></div>
				<div class="body"><div class="t"><?php echo esc_html( $p->post_title ); ?></div><div class="muted small"><?php echo esc_html( $r['label'] . ' · ' . get_post_meta( $p->ID, 'price', true ) ); ?></div></div>
				<?php if ( $i === 0 ) : ?><span class="brush" style="font-size:10px;padding:1px 8px;--theme:var(--theme2)">재입고</span><?php else : ?><span class="chip"><span>신상</span></span><?php endif; ?>
			</a>
			<?php endforeach; ?>
		</section>
		<?php endif; ?>

	</div>
</div>
<?php get_footer(); ?>
