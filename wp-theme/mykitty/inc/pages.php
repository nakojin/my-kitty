<?php
/**
 * 테마 활성화 시 필요한 페이지를 만들고 템플릿을 지정한다. (도감·마이·온보딩·공유 카드·소개·랭킹 출처)
 * 이미 같은 slug 가 있으면 건드리지 않는다.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'after_switch_theme', function () {
	$pages = [
		'collection'      => [ '도감', 'page-collection.php', '' ],
		'my'              => [ '마이', 'page-my.php', '' ],
		'onboarding'      => [ '시작하기', 'page-onboarding.php', '' ],
		'share'           => [ '공유 카드', 'page-share.php', '' ],
		'about'           => [ '소개', '', mykitty_default_about_content() ],
		'ranking-sources' => [ '랭킹 근거 자료', '', '<p>랭킹은 편집부 선정이며, 근거 자료는 저장소 <code>docs/ux/06-ranking-sources.md</code> 의 내용을 이 페이지에 옮겨 적어 주세요.</p>' ],
	];
	foreach ( $pages as $slug => [ $title, $template, $content ] ) {
		if ( get_page_by_path( $slug ) ) { continue; }
		$id = wp_insert_post( [ 'post_type' => 'page', 'post_status' => 'publish', 'post_name' => $slug, 'post_title' => $title, 'post_content' => $content ] );
		if ( $id && ! is_wp_error( $id ) && $template ) { update_post_meta( $id, '_wp_page_template', $template ); }
	}
	// 홈을 front-page.php 로 (최신 글 목록은 /posts/ 로 이동)
	if ( ! get_page_by_path( 'posts' ) ) {
		$blog = wp_insert_post( [ 'post_type' => 'page', 'post_status' => 'publish', 'post_name' => 'posts', 'post_title' => '피규어 추천 글' ] );
		update_option( 'page_for_posts', $blog );
	}
	update_option( 'show_on_front', 'page' );
	if ( ! get_option( 'page_on_front' ) ) {
		$home = wp_insert_post( [ 'post_type' => 'page', 'post_status' => 'publish', 'post_name' => 'home', 'post_title' => '홈' ] );
		update_option( 'page_on_front', $home );
	}
	flush_rewrite_rules();
} );

function mykitty_default_about_content(): string {
	return <<<HTML
<p><strong>마이키티</strong>는 애니메이션 피규어를 <strong>도감처럼 모으고, 추천받고, 쿠팡에서 사는</strong> 서비스입니다. 작품마다 입문용부터 소장용까지 실패 없는 선택지를 고르고, 정품 확인법과 가격대를 함께 적습니다.</p>
<h2>제휴 안내</h2>
<p>이 사이트는 쿠팡 파트너스 활동의 일환으로, 글에 포함된 쿠팡 링크를 통해 구매가 이루어지면 일정액의 수수료를 제공받습니다. 수수료는 구매자가 지불하는 가격에 영향을 주지 않으며, 추천 상품 선정은 제휴 여부와 무관하게 이루어집니다.</p>
<h2>가격 안내</h2>
<p>글에 적힌 가격대는 작성 시점의 대략적인 시세입니다. 피규어는 재고와 재판 여부에 따라 가격 변동이 크니, 실제 가격은 구매 페이지에서 확인해 주세요.</p>
<h2>뽑기·도감 안내</h2>
<p>"오늘의 뽑기"는 실제 과금이나 확률 아이템이 아니라 추천 피규어를 공개하는 연출입니다. 도감·레벨·뱃지는 서비스 내 재미 요소이며 금전적 가치가 없습니다.</p>
HTML;
}
