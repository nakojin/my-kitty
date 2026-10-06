<?php
/**
 * My Kitty 테마 부트스트랩.
 * 이식 단계 1: 토큰·컴포넌트·콘텐츠 모델. (docs/ux/04-wordpress-mapping.md)
 */

defined( 'ABSPATH' ) || exit;

define( 'MYKITTY_VERSION', '0.1.0' );
define( 'MYKITTY_DIR', get_template_directory() );
define( 'MYKITTY_URI', get_template_directory_uri() );

require MYKITTY_DIR . '/inc/post-types.php';
require MYKITTY_DIR . '/inc/template-tags.php';

add_action( 'after_setup_theme', function () {
	load_theme_textdomain( 'mykitty', MYKITTY_DIR . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', [ 'search-form', 'gallery', 'caption', 'style', 'script' ] );
	register_nav_menus( [ 'tabbar' => __( '하단 탭바', 'mykitty' ) ] );
	add_image_size( 'mk-poster', 480, 640, true );   // 3:4 포스터 타일
	add_image_size( 'mk-hero', 1536, 2048, false );  // 월드 히어로
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'mykitty-tokens', MYKITTY_URI . '/assets/css/tokens.css', [], MYKITTY_VERSION );
	wp_enqueue_style( 'mykitty-components', MYKITTY_URI . '/assets/css/components.css', [ 'mykitty-tokens' ], MYKITTY_VERSION );
	wp_enqueue_style( 'mykitty-theme', MYKITTY_URI . '/assets/css/theme.css', [ 'mykitty-components' ], MYKITTY_VERSION );

	// 상태(도감·XP·스트릭)는 프로토타입 store.js 를 그대로 사용한다.
	wp_enqueue_script( 'mykitty-store', MYKITTY_URI . '/assets/js/store.js', [], MYKITTY_VERSION, true );
	wp_localize_script( 'mykitty-store', 'MK_ENV', [
		'rest'   => esc_url_raw( rest_url( 'mk/v1/' ) ),
		'nonce'  => wp_create_nonce( 'wp_rest' ),
		'logged' => is_user_logged_in(),
	] );
} );

// 월드 데이터를 JS 전역(MK_WORLDS, MK_FIGURES)으로 내보낸다. store.js 가 기대하는 형태 그대로.
add_action( 'wp_head', function () {
	$worlds  = mykitty_worlds_for_js();
	$figures = mykitty_figures_for_js();
	printf(
		"<script>window.MK_WORLDS=%s;window.MK_FIGURES=%s;window.MK_RARITY=%s;</script>\n",
		wp_json_encode( $worlds, JSON_UNESCAPED_UNICODE ),
		wp_json_encode( $figures, JSON_UNESCAPED_UNICODE ),
		wp_json_encode( mykitty_rarity_map(), JSON_UNESCAPED_UNICODE )
	);
}, 5 );

// 붓칠·잉크 거친 가장자리 필터. 모든 페이지에 한 번.
add_action( 'wp_body_open', function () {
	echo '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="rough" x="-10%" y="-20%" width="120%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter></svg>' . "\n";
} );

// 쿠팡 파트너스 링크는 항상 sponsored nofollow.
add_filter( 'the_content', function ( $content ) {
	return preg_replace_callback(
		'#<a\s+([^>]*href="https?://(?:link\.)?coupang\.com[^"]*"[^>]*)>#i',
		function ( $m ) {
			$attrs = preg_replace( '/\srel="[^"]*"/i', '', $m[1] );
			return '<a ' . $attrs . ' rel="sponsored nofollow noopener" target="_blank">';
		},
		$content
	);
} );
