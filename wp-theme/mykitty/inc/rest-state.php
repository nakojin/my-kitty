<?php
/**
 * 로그인 사용자의 도감·XP 상태 동기화. GET/POST /wp-json/mk/v1/state
 * 저장 구조는 프로토타입 store.js 의 state 와 동일(user_meta 'mk_state').
 * 비로그인은 호출하지 않고 localStorage 만 쓴다.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'rest_api_init', function () {
	register_rest_route( 'mk/v1', '/state', [
		[
			'methods'             => 'GET',
			'permission_callback' => 'is_user_logged_in',
			'callback'            => fn() => rest_ensure_response( get_user_meta( get_current_user_id(), 'mk_state', true ) ?: new stdClass() ),
		],
		[
			'methods'             => 'POST',
			'permission_callback' => 'is_user_logged_in',
			'callback'            => function ( WP_REST_Request $req ) {
				$state = $req->get_json_params();
				if ( ! is_array( $state ) ) { return new WP_Error( 'bad_state', 'JSON 객체가 필요합니다.', [ 'status' => 400 ] ); }
				// 허용 키만 저장. 크기 제한(피규어 수천 개 수준까지).
				$allowed = [ 'onboarded', 'nick', 'worlds', 'coll', 'xp', 'streak', 'lastCheckin', 'lastGacha', 'gachaResult', 'badges', 'quests', 'badgesMeta' ];
				$clean   = array_intersect_key( $state, array_flip( $allowed ) );
				if ( strlen( wp_json_encode( $clean ) ) > 200000 ) { return new WP_Error( 'too_big', '상태가 너무 큽니다.', [ 'status' => 413 ] ); }
				update_user_meta( get_current_user_id(), 'mk_state', $clean );
				return rest_ensure_response( [ 'ok' => true, 'savedAt' => time() ] );
			},
		],
	] );
} );
