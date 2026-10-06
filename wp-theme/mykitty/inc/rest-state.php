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
				if ( array_is_list( $state ) ) { return new WP_Error( 'bad_state', 'JSON 객체가 필요합니다.', [ 'status' => 400 ] ); }
				$allowed = [ 'onboarded', 'nick', 'worlds', 'coll', 'xpColl', 'xp', 'streak', 'lastCheckin', 'lastGacha', 'gachaResult', 'badges', 'quests', 'badgesMeta' ];
				$clean   = array_intersect_key( $state, array_flip( $allowed ) );
				// 타입 강제: 잘못된 형태가 저장되면 클라이언트가 TypeError 로 멈춘다.
				$str  = fn( $k ) => isset( $clean[ $k ] ) ? sanitize_text_field( (string) $clean[ $k ] ) : '';
				$list = fn( $k ) => isset( $clean[ $k ] ) && is_array( $clean[ $k ] ) && array_is_list( $clean[ $k ] ) ? array_values( array_map( 'sanitize_key', $clean[ $k ] ) ) : [];
				$map  = fn( $k ) => isset( $clean[ $k ] ) && is_array( $clean[ $k ] ) && ! array_is_list( $clean[ $k ] ) ? $clean[ $k ] : [];
				$clean = [
					'onboarded'   => ! empty( $clean['onboarded'] ),
					'nick'        => mb_substr( $str( 'nick' ), 0, 20 ),
					'worlds'      => array_slice( $list( 'worlds' ), 0, 5 ),
					'coll'        => array_filter( array_map( fn( $v ) => in_array( $v, [ 'own', 'wish' ], true ) ? $v : null, $map( 'coll' ) ) ),
					'xpColl'      => array_map( fn() => 1, $map( 'xpColl' ) ),
					'xp'          => max( 0, (int) ( $clean['xp'] ?? 0 ) ),
					'streak'      => max( 0, (int) ( $clean['streak'] ?? 0 ) ),
					'lastCheckin' => $str( 'lastCheckin' ),
					'lastGacha'   => $str( 'lastGacha' ),
					'gachaResult' => $str( 'gachaResult' ),
					'badges'      => $list( 'badges' ),
					'quests'      => array_map( 'sanitize_text_field', array_filter( $map( 'quests' ), 'is_string' ) ),
					'badgesMeta'  => array_map( 'intval', array_filter( $map( 'badgesMeta' ), 'is_numeric' ) ),
				];
				if ( strlen( wp_json_encode( $clean ) ) > 200000 ) { return new WP_Error( 'too_big', '상태가 너무 큽니다.', [ 'status' => 413 ] ); }
				update_user_meta( get_current_user_id(), 'mk_state', $clean );
				return rest_ensure_response( [ 'ok' => true, 'savedAt' => time() ] );
			},
		],
	] );
} );
