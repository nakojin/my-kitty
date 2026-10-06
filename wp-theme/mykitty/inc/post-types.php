<?php
/**
 * 콘텐츠 모델.
 *   taxonomy world         — 작품(월드). term meta: theme, theme2, on_theme, g, world_no, hero_slot, characters(csv), curation_post
 *   CPT figure             — 피규어. post meta: maker, line, size, price, rarity, why, coupang_url, product_image, character
 *   CPT ranking_entry      — 랭킹 항목. post meta: rank, year, kind, decade, note, fig(1~3), world(term slug)
 *   taxonomy ranking_board — newera-kr / newera-jp / newera-cn / newera-asia / legend
 * 메타는 register_post_meta/term_meta 로 등록해 REST·블록 에디터에서 보이게 한다. ACF 를 쓰면 같은 키를 그대로 매핑.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'init', function () {

	register_taxonomy( 'world', [ 'figure', 'post', 'ranking_entry' ], [
		'labels'            => [ 'name' => '월드', 'singular_name' => '월드', 'add_new_item' => '월드 추가' ],
		'public'            => true,
		'hierarchical'      => false,
		'show_in_rest'      => true,
		'show_admin_column' => true,
		'rewrite'           => [ 'slug' => 'world' ],
	] );

	foreach ( [
		'theme'         => 'string', 'theme2' => 'string', 'on_theme' => 'string',
		'g'             => 'integer', 'world_no' => 'integer', 'hero_slot' => 'string',
		'characters'    => 'string', 'curation_post' => 'integer',
	] as $key => $type ) {
		register_term_meta( 'world', $key, [ 'type' => $type, 'single' => true, 'show_in_rest' => true ] );
	}

	register_post_type( 'figure', [
		'labels'       => [ 'name' => '피규어', 'singular_name' => '피규어', 'add_new_item' => '피규어 추가' ],
		'public'       => true,
		'has_archive'  => true,
		'show_in_rest' => true,
		'menu_icon'    => 'dashicons-art',
		'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ],
		'rewrite'      => [ 'slug' => 'figure' ],
		'taxonomies'   => [ 'world' ],
	] );

	foreach ( [
		'maker' => 'string', 'line' => 'string', 'size' => 'string', 'price' => 'string',
		'rarity' => 'string', 'why' => 'string', 'coupang_url' => 'string',
		'product_image' => 'string', 'character' => 'string',
	] as $key => $type ) {
		register_post_meta( 'figure', $key, [
			'type' => $type, 'single' => true, 'show_in_rest' => true,
			'sanitize_callback' => $key === 'coupang_url' || $key === 'product_image' ? 'esc_url_raw' : 'sanitize_text_field',
		] );
	}

	register_taxonomy( 'ranking_board', [ 'ranking_entry' ], [
		'labels'            => [ 'name' => '랭킹 보드', 'singular_name' => '랭킹 보드' ],
		'public'            => true,
		'hierarchical'      => true,
		'show_in_rest'      => true,
		'show_admin_column' => true,
		'rewrite'           => [ 'slug' => 'ranking' ],
	] );

	register_post_type( 'ranking_entry', [
		'labels'       => [ 'name' => '랭킹 항목', 'singular_name' => '랭킹 항목', 'add_new_item' => '랭킹 항목 추가' ],
		'public'       => true,
		'has_archive'  => false,
		'show_in_rest' => true,
		'menu_icon'    => 'dashicons-chart-bar',
		'supports'     => [ 'title', 'custom-fields' ],
		'rewrite'      => [ 'slug' => 'ranking-entry' ],
		'taxonomies'   => [ 'ranking_board', 'world' ],
	] );

	foreach ( [ 'rank' => 'integer', 'year' => 'integer', 'kind' => 'string', 'decade' => 'string', 'note' => 'string', 'fig' => 'integer' ] as $key => $type ) {
		register_post_meta( 'ranking_entry', $key, [ 'type' => $type, 'single' => true, 'show_in_rest' => true, 'sanitize_callback' => 'sanitize_text_field' ] );
	}
} );

// 테마 활성화 시 기본 term 생성 (월드 9개, 랭킹 보드 5개).
add_action( 'after_switch_theme', function () {
	$worlds = [
		[ 'kny', '귀멸의 칼날', '#2fd36f', '#ff7a1a', '#000', 40, 1, '탄지로,네즈코,렌고쿠,젠이츠,이노스케,기유' ],
		[ 'jjk', '주술회전', '#4f6df5', '#b06cff', '#fff', 40, 2, '고죠,이타도리,스쿠나,메구미,노바라,토지' ],
		[ 'csm', '체인소맨', '#ff6a00', '#f2f0ea', '#000', 45, 3, '덴지,파워,마키마,레제,아키,포치타' ],
		[ 'op', '원피스', '#ffcc33', '#2eb3ff', '#000', 35, 4, '루피,조로,나미,상디,초파,로빈,에이스,샹크스' ],
		[ 'frn', '장송의 프리렌', '#c9b6ff', '#f2f0ea', '#000', 30, 5, '프리렌,페른,슈타르크,힘멜,하이터,아이젠' ],
		[ 'sxf', '스파이 패밀리', '#1fb27a', '#ff8fb1', '#000', 40, 6, '아냐,요르,로이드,본드,다미안,베키' ],
		[ 'blc', '블리치', '#ff3d6e', '#9be7ff', '#000', 40, 7, '이치고,루키아,뱌쿠야,아이젠,우라하라,켄파치' ],
		[ 'onk', '최애의 아이', '#ff8ad8', '#7cf0ff', '#000', 35, 8, '아이,루비,아쿠아,카나,아카네,멤쵸' ],
		[ 'gdm', '건담', '#5aa9ff', '#ffd34d', '#000', 40, 9, 'RX-78-2,스트라이크 프리덤,유니콘,뉴 건담,바르바토스,에어리얼' ],
	];
	foreach ( $worlds as [ $slug, $name, $t, $t2, $on, $g, $no, $chars ] ) {
		$term = term_exists( $slug, 'world' ) ?: wp_insert_term( $name, 'world', [ 'slug' => $slug ] );
		if ( is_wp_error( $term ) ) { continue; }
		$id = (int) $term['term_id'];
		update_term_meta( $id, 'theme', $t ); update_term_meta( $id, 'theme2', $t2 ); update_term_meta( $id, 'on_theme', $on );
		update_term_meta( $id, 'g', $g ); update_term_meta( $id, 'world_no', $no );
		update_term_meta( $id, 'hero_slot', 'IMG-W' . str_pad( $no, 2, '0', STR_PAD_LEFT ) . '-HERO' );
		update_term_meta( $id, 'characters', $chars );
	}
	foreach ( [ 'newera-kr' => '신시대 · 한국', 'newera-jp' => '신시대 · 일본', 'newera-cn' => '신시대 · 중국', 'newera-asia' => '신시대 · 아시아', 'legend' => '레전드' ] as $slug => $name ) {
		if ( ! term_exists( $slug, 'ranking_board' ) ) { wp_insert_term( $name, 'ranking_board', [ 'slug' => $slug ] ); }
	}
} );
