<?php
/**
 * OG·트위터 메타, canonical, 월드/피규어 제목. SEO 플러그인(Yoast·Rank Math)을 쓰면 이 파일은 비활성화해도 된다.
 * 사이트맵은 워드프레스 코어(/wp-sitemap.xml)가 figure·world·ranking_board 를 포함한다(모두 public).
 */

defined( 'ABSPATH' ) || exit;

function mykitty_og_image(): string {
	if ( is_singular() && has_post_thumbnail() ) { return get_the_post_thumbnail_url( null, 'large' ) ?: ''; }
	if ( is_singular( 'figure' ) && ( $img = get_post_meta( get_the_ID(), 'product_image', true ) ) ) { return $img; }
	if ( is_tax( 'world' ) ) {
		$slot = get_term_meta( get_queried_object_id(), 'hero_slot', true );
		if ( $slot && file_exists( MYKITTY_DIR . "/assets/img/$slot.webp" ) ) { return MYKITTY_URI . "/assets/img/$slot.webp"; }
	}
	return file_exists( MYKITTY_DIR . '/assets/img/IMG-OG.webp' ) ? MYKITTY_URI . '/assets/img/IMG-OG.webp' : '';
}

function mykitty_og_description(): string {
	if ( is_singular( 'figure' ) ) { return (string) get_post_meta( get_the_ID(), 'why', true ); }
	if ( is_singular() ) { return wp_strip_all_tags( get_the_excerpt() ); }
	if ( is_tax( 'world' ) ) { return get_queried_object()->name . ' 피규어를 입문용부터 소장용까지. 도감으로 모으고 쿠팡에서 바로.'; }
	if ( is_tax( 'ranking_board' ) ) { return '한국·일본·중국·아시아 신시대 TOP 20과 1980년대부터의 레전드 TOP 30.'; }
	return get_bloginfo( 'description' );
}

add_action( 'wp_head', function () {
	if ( is_admin() || is_404() ) { return; }
	$title = wp_get_document_title();
	$desc  = mykitty_og_description();
	$url   = is_singular() ? get_permalink() : ( is_tax() ? get_term_link( get_queried_object() ) : home_url( add_query_arg( [] ) ) );
	$img   = mykitty_og_image();
	echo "\n<meta name=\"description\" content=\"" . esc_attr( $desc ) . "\">\n";
	echo '<link rel="canonical" href="' . esc_url( $url ) . "\">\n";
	echo '<meta property="og:type" content="' . ( is_singular( 'post' ) ? 'article' : 'website' ) . "\">\n";
	echo '<meta property="og:site_name" content="' . esc_attr( get_bloginfo( 'name' ) ) . "\">\n";
	echo '<meta property="og:title" content="' . esc_attr( $title ) . "\">\n";
	echo '<meta property="og:description" content="' . esc_attr( $desc ) . "\">\n";
	echo '<meta property="og:url" content="' . esc_url( $url ) . "\">\n";
	echo "<meta property=\"og:locale\" content=\"ko_KR\">\n";
	if ( $img ) { echo '<meta property="og:image" content="' . esc_url( $img ) . "\">\n<meta name=\"twitter:card\" content=\"summary_large_image\">\n"; }
	else { echo "<meta name=\"twitter:card\" content=\"summary\">\n"; }
	// 온보딩·마이·공유 카드처럼 사용자 상태 페이지는 색인하지 않는다.
	if ( is_page( [ 'onboarding', 'my', 'share', 'collection' ] ) ) { echo "<meta name=\"robots\" content=\"noindex,follow\">\n"; }
}, 1 );

// <title> 보강: 월드 → "귀멸의 칼날 피규어 도감", 랭킹 보드 → 보드 이름.
add_filter( 'document_title_parts', function ( $parts ) {
	if ( is_tax( 'world' ) ) { $parts['title'] = get_queried_object()->name . ' 피규어 도감'; }
	if ( is_tax( 'ranking_board' ) ) { $parts['title'] = '애니 랭킹 · ' . get_queried_object()->name; }
	return $parts;
} );
