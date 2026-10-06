<?php
/**
 * 템플릿 태그. 프로토타입 js/views.js 의 헬퍼(slot, chip, posterFig, rankRow)에 1:1 대응한다.
 */

defined( 'ABSPATH' ) || exit;

function mykitty_rarity_map(): array {
	return [
		'common'    => [ 'label' => '일반', 'hint' => '프라이즈 · 2~4만', 'color' => '#9aa0a6' ],
		'rare'      => [ 'label' => '레어', 'hint' => 'POP UP PARADE · 넨도 · 5~9만', 'color' => '#4fc3f7' ],
		'epic'      => [ 'label' => '에픽', 'hint' => '스케일 1/8~1/7 · 10~25만', 'color' => '#b06cff' ],
		'legendary' => [ 'label' => '전설', 'hint' => '한정판 · 재판 없음', 'color' => '#ffcc33' ],
	];
}

/** get_term_link 가 WP_Error 를 돌려줄 때 빈 문자열로. PHP 8 에서 esc_url(WP_Error) 는 TypeError 다. */
function mykitty_term_url( $term, string $taxonomy = '' ): string {
	$u = get_term_link( $term, $taxonomy );
	return is_wp_error( $u ) ? '' : $u;
}

/** 레어리티 키 정규화. 알 수 없는 값은 common. */
function mykitty_rarity_key( $raw ): string {
	return isset( mykitty_rarity_map()[ $raw ] ) ? $raw : 'common';
}

/** 월드 term → 인라인 CSS 변수. 월드 페이지·카드·헤더에 붙인다. */
function mykitty_world_style( WP_Term|int|null $term ): string {
	$term = $term instanceof WP_Term ? $term : get_term( (int) $term, 'world' );
	if ( ! $term || is_wp_error( $term ) ) { return ''; }
	$id = $term->term_id;
	return sprintf(
		'--theme:%s;--theme2:%s;--on-theme:%s;--g:%d%%',
		esc_attr( get_term_meta( $id, 'theme', true ) ?: '#2fd36f' ),
		esc_attr( get_term_meta( $id, 'theme2', true ) ?: '#ff7a1a' ),
		esc_attr( get_term_meta( $id, 'on_theme', true ) ?: '#000' ),
		(int) ( get_term_meta( $id, 'g', true ) ?: 40 )
	);
}

/** 피규어 post 의 월드 term (첫 번째). */
function mykitty_figure_world( int $post_id ): ?WP_Term {
	$terms = get_the_terms( $post_id, 'world' );
	return $terms && ! is_wp_error( $terms ) ? $terms[0] : null;
}

/** 이미지 슬롯. 파일이 없으면 슬롯 ID 자리표시자. $src 가 있으면 그 이미지(쿠팡 제공 등). */
function mykitty_img_slot( string $slot_id, string $class = '', string $src = '', string $inner = '' ): void {
	get_template_part( 'template-parts/img-slot', null, [ 'slot' => $slot_id, 'class' => $class, 'src' => $src, 'inner' => $inner ] );
}

function mykitty_chip( string $label, bool $on = false, string $class = '', string $href = '' ): void {
	get_template_part( 'template-parts/chip', null, [ 'label' => $label, 'on' => $on, 'class' => $class, 'href' => $href ] );
}

function mykitty_figure_card( int $post_id ): void {
	get_template_part( 'template-parts/figure-card', null, [ 'id' => $post_id ] );
}

function mykitty_rank_row( int $post_id, bool $compact = false ): void {
	get_template_part( 'template-parts/rank-row', null, [ 'id' => $post_id, 'compact' => $compact ] );
}

/** 쿠팡 CTA. 링크 없으면 '준비 중'. 어떤 월드에서도 색·속성 동일. */
function mykitty_coupang_cta( string $url, string $label = '쿠팡에서 보기' ): void {
	if ( $url ) {
		printf( '<a class="cta" href="%s" target="_blank" rel="sponsored nofollow noopener"><span>%s</span></a>', esc_url( $url ), esc_html( $label ) );
	} else {
		echo '<span class="cta pending"><span>쿠팡 링크 준비 중</span></span>';
	}
}

/* ── JS 전역용 직렬화 (store.js 가 MK_WORLDS / MK_FIGURES 를 기대) ── */

function mykitty_worlds_for_js(): array {
	$out = [];
	foreach ( get_terms( [ 'taxonomy' => 'world', 'hide_empty' => false ] ) as $t ) {
		if ( is_wp_error( $t ) ) { continue; }
		$id  = $t->term_id;
		$out[] = [
			'id'     => $t->slug,
			'no'     => (int) get_term_meta( $id, 'world_no', true ),
			'title'  => $t->name,
			'theme'  => get_term_meta( $id, 'theme', true ),
			'theme2' => get_term_meta( $id, 'theme2', true ),
			'on'     => get_term_meta( $id, 'on_theme', true ),
			'g'      => (int) get_term_meta( $id, 'g', true ),
			'img'    => get_term_meta( $id, 'hero_slot', true ),
			'chars'  => array_values( array_filter( array_map( 'trim', explode( ',', (string) get_term_meta( $id, 'characters', true ) ) ) ) ),
			'url'    => mykitty_term_url( $t ),
		];
	}
	usort( $out, fn( $a, $b ) => $a['no'] <=> $b['no'] );
	return $out;
}

function mykitty_figures_for_js(): array {
	$q   = new WP_Query( [ 'post_type' => 'figure', 'posts_per_page' => -1, 'post_status' => 'publish', 'no_found_rows' => true ] );
	$out = [];
	foreach ( $q->posts as $p ) {
		$w = mykitty_figure_world( $p->ID );
		$out[] = [
			'id'         => $p->post_name,
			'world'      => $w ? $w->slug : '',
			'char'       => get_post_meta( $p->ID, 'character', true ),
			'name'       => $p->post_title,
			'maker'      => get_post_meta( $p->ID, 'maker', true ),
			'line'       => get_post_meta( $p->ID, 'line', true ),
			'size'       => get_post_meta( $p->ID, 'size', true ),
			'price'      => get_post_meta( $p->ID, 'price', true ),
			'rarity'     => mykitty_rarity_key( get_post_meta( $p->ID, 'rarity', true ) ),
			'why'        => get_post_meta( $p->ID, 'why', true ),
			'coupangUrl' => get_post_meta( $p->ID, 'coupang_url', true ),
			'img'        => get_post_meta( $p->ID, 'product_image', true ) ?: ( get_the_post_thumbnail_url( $p->ID, 'mk-poster' ) ?: '' ),
			'url'        => get_permalink( $p->ID ),
		];
	}
	return $out;
}
