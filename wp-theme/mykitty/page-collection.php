<?php
/**
 * Template Name: 도감
 * 도감 (S5). /collection/?w=kny . 서버: 선택 월드의 피규어 전부. 클라이언트: 상태 칠하기·필터·완성도.
 */
get_header();
$worlds = get_terms( [ 'taxonomy' => 'world', 'hide_empty' => false, 'meta_key' => 'world_no', 'orderby' => 'meta_value_num' ] );
$slug   = sanitize_key( $_GET['w'] ?? '' );
$world  = $slug ? get_term_by( 'slug', $slug, 'world' ) : null;
if ( ! $world && $worlds && ! is_wp_error( $worlds ) ) { $world = $worlds[0]; }
$figs   = $world ? get_posts( [ 'post_type' => 'figure', 'posts_per_page' => -1, 'tax_query' => [ [ 'taxonomy' => 'world', 'field' => 'term_id', 'terms' => $world->term_id ] ], 'orderby' => 'menu_order title', 'order' => 'ASC' ] ) : [];
$ids    = array_map( fn( $p ) => $p->post_name, $figs );
?>
<div class="view pad" data-screen="collection" style="<?php echo $world ? mykitty_world_style( $world ) : ''; ?>display:flex;flex-direction:column;gap:12px;position:relative">
	<div class="splat ink" style="width:60px;height:60px;left:-26px;top:120px;opacity:.1"></div>
	<div style="display:flex;justify-content:space-between;align-items:center">
		<h1 class="display" style="font-size:26px;margin:0">도감</h1>
		<a class="chip" href="<?php echo esc_url( home_url( '/share/' ) ); ?>"><span>공유 카드 <?php echo mykitty_icon( 'arrow-up-right' ); ?></span></a>
	</div>

	<!-- 월드 칩: 사용자가 고른 월드만 보이게 app.js 가 data-my-world 로 숨김/표시 -->
	<div class="chips" data-world-chips>
		<?php foreach ( (array) $worlds as $w ) : if ( is_wp_error( $w ) ) continue; ?>
			<a class="chip <?php echo $world && $w->term_id === $world->term_id ? 'on' : ''; ?>" href="<?php echo esc_url( add_query_arg( 'w', $w->slug, get_permalink() ) ); ?>" data-my-world="<?php echo esc_attr( $w->slug ); ?>"><span><?php echo esc_html( $w->name ); ?></span></a>
		<?php endforeach; ?>
	</div>

	<?php if ( $world ) : ?>
	<div class="panel" style="display:flex;gap:14px;align-items:center">
		<div class="ring" data-ring="<?php echo esc_attr( $world->slug ); ?>" style="--p:0"><span data-completion="<?php echo esc_attr( $world->slug ); ?>">0%</span></div>
		<div>
			<div class="t"><?php echo esc_html( $world->name ); ?></div>
			<div class="muted small">보유 <span data-count="own">0</span> · 위시 <span data-count="wish">0</span> · 미보유 <span data-count="none"><?php echo count( $figs ); ?></span></div>
			<div class="muted" style="font-size:11px">일반 <span data-count="common">0</span> · 레어 <span data-count="rare">0</span> · 에픽 <span data-count="epic">0</span> · 전설 <span data-count="legendary">0</span></div>
		</div>
	</div>

	<div class="chips" data-status-filter>
		<?php foreach ( [ 'all' => '전체', 'own' => '보유', 'wish' => '위시', 'none' => '미보유' ] as $k => $l ) : ?>
			<button type="button" class="chip <?php echo $k === 'all' ? 'on' : ''; ?>" data-filter="<?php echo $k; ?>"><span><?php echo $l; ?></span></button>
		<?php endforeach; ?>
	</div>

	<div class="grid3" data-figure-grid data-world="<?php echo esc_attr( $world->slug ); ?>" data-ids="<?php echo esc_attr( implode( ',', $ids ) ); ?>">
		<?php foreach ( $figs as $p ) { mykitty_figure_card( $p->ID ); } ?>
	</div>
	<div class="muted small" style="padding:20px;text-align:center;display:none" data-empty>해당하는 피규어가 없어요</div>
	<p class="muted" style="font-size:11px;text-align:center">탭하면 상세 · 상세에서 보유/위시 변경</p>
	<?php else : ?>
	<div class="panel flat muted small">월드가 없어요. 테마를 다시 활성화하거나 월드 term 을 추가하세요.</div>
	<?php endif; ?>
</div>
<?php get_footer(); ?>
