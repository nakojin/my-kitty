<?php
/**
 * CSV → 워드프레스. WP-CLI: wp eval-file wp-theme/import/import.php
 * 같은 slug 가 있으면 갱신(멱등). 테마 'mykitty' 가 활성화되어 있어야 CPT 가 등록돼 있다.
 */

defined( 'WP_CLI' ) || exit( "WP-CLI 에서 실행하세요.\n" );
// 권장: wp eval-file wp-theme/import/import.php --user=<관리자 로그인>  (unfiltered_html 로 본문 마크업 보존)
if ( ! current_user_can( 'unfiltered_html' ) ) { WP_CLI::warning( '--user=<관리자> 없이 실행 중: 글 본문의 일부 HTML 이 kses 필터로 제거될 수 있습니다.' ); }
mykitty_register_content_model();

$dir  = __DIR__;
$read = function ( string $file ) use ( $dir ): array {
	$fh = fopen( "$dir/$file", 'r' ); $head = fgetcsv( $fh ); $rows = [];
	while ( ( $r = fgetcsv( $fh ) ) !== false ) { if ( count( $r ) !== count( $head ) ) { continue; } $rows[] = array_combine( $head, $r ); }
	fclose( $fh ); return $rows;
};

/* worlds */
foreach ( $read( 'worlds.csv' ) as $w ) {
	$term = term_exists( $w['slug'], 'world' ) ?: wp_insert_term( $w['name'], 'world', [ 'slug' => $w['slug'] ] );
	if ( is_wp_error( $term ) ) { WP_CLI::warning( "world {$w['slug']}: " . $term->get_error_message() ); continue; }
	$id = (int) $term['term_id'];
	wp_update_term( $id, 'world', [ 'name' => $w['name'] ] );
	foreach ( [ 'world_no', 'theme', 'theme2', 'on_theme', 'g', 'hero_slot', 'characters' ] as $k ) { update_term_meta( $id, $k, $w[ $k ] ); }
	if ( $w['curation_post'] ) {
		$p = get_page_by_path( $w['curation_post'], OBJECT, 'post' );
		if ( $p ) { update_term_meta( $id, 'curation_post', $p->ID ); }
	}
}
WP_CLI::success( 'worlds' );

/* figures */
$n = 0;
foreach ( $read( 'figures.csv' ) as $f ) {
	$existing = get_page_by_path( $f['post_name'], OBJECT, 'figure' );
	$post_id  = wp_insert_post( wp_slash( [
		'ID' => $existing ? $existing->ID : 0, 'post_type' => 'figure', 'post_status' => 'publish',
		'post_name' => $f['post_name'], 'post_title' => $f['post_title'], 'post_excerpt' => $f['why'],
	] ), true );
	if ( is_wp_error( $post_id ) ) { WP_CLI::warning( "figure {$f['post_name']}: " . $post_id->get_error_message() ); continue; }
	foreach ( [ 'character', 'maker', 'line', 'size', 'price', 'rarity', 'why', 'coupang_url', 'product_image' ] as $k ) { update_post_meta( $post_id, $k, $f[ $k ] ); }
	wp_set_object_terms( $post_id, $f['world'], 'world' );
	$n++;
}
WP_CLI::success( "figures: $n" );

/* rankings */
$n = 0;
foreach ( $read( 'rankings.csv' ) as $r ) {
	$slug     = sanitize_title( $r['board'] . '-' . $r['rank'] . '-' . $r['post_title'] );
	$existing = get_page_by_path( $slug, OBJECT, 'ranking_entry' );
	$post_id  = wp_insert_post( wp_slash( [
		'ID' => $existing ? $existing->ID : 0, 'post_type' => 'ranking_entry', 'post_status' => 'publish',
		'post_name' => $slug, 'post_title' => $r['post_title'],
	] ), true );
	if ( is_wp_error( $post_id ) ) { WP_CLI::warning( "ranking $slug: " . $post_id->get_error_message() ); continue; }
	foreach ( [ 'rank', 'year', 'kind', 'decade', 'note', 'fig' ] as $k ) { update_post_meta( $post_id, $k, $r[ $k ] ); }
	$board = get_term_by( 'slug', $r['board'], 'ranking_board' );
	if ( $board ) { wp_set_object_terms( $post_id, [ (int) $board->term_id ], 'ranking_board' ); } else { WP_CLI::warning( "ranking_board '{$r['board']}' 없음 — 테마를 활성화했는지 확인" ); }
	if ( $r['world'] ) { wp_set_object_terms( $post_id, $r['world'], 'world' ); }
	$n++;
}
WP_CLI::success( "rankings: $n" );

/* posts (블로그 글 6편) + 월드의 curation_post 연결 */
$n = 0;
foreach ( json_decode( file_get_contents( "$dir/posts.json" ), true ) ?: [] as $p ) {
	$existing = get_page_by_path( $p['slug'], OBJECT, 'post' );
	// 미래 날짜면 '예약' 상태가 되어 공개되지 않으므로 지금 시각으로 당긴다.
	$date = $p['date'] ? $p['date'] . ' 09:00:00' : current_time( 'mysql' );
	if ( $date > current_time( 'mysql' ) ) { $date = current_time( 'mysql' ); }
	$post_id  = wp_insert_post( wp_slash( [
		'ID' => $existing ? $existing->ID : 0, 'post_type' => 'post', 'post_status' => 'publish',
		'post_name' => $p['slug'], 'post_title' => $p['title'], 'post_excerpt' => $p['excerpt'],
		'post_content' => $p['html'], 'post_date' => $date,
	] ), true );
	if ( is_wp_error( $post_id ) ) { WP_CLI::warning( "post {$p['slug']}: " . $post_id->get_error_message() ); continue; }
	if ( $p['world'] ) {
		wp_set_object_terms( $post_id, $p['world'], 'world' );
		$term = get_term_by( 'slug', $p['world'], 'world' );
		if ( $term ) { update_term_meta( $term->term_id, 'curation_post', $post_id ); }
	}
	$n++;
}
WP_CLI::success( "posts: $n" );
