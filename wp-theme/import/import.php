<?php
/**
 * CSV → 워드프레스. WP-CLI: wp eval-file wp-theme/import/import.php
 * 같은 slug 가 있으면 갱신(멱등). 테마 'mykitty' 가 활성화되어 있어야 CPT 가 등록돼 있다.
 */

defined( 'WP_CLI' ) || exit( "WP-CLI 에서 실행하세요.\n" );

$dir  = __DIR__;
$read = function ( string $file ) use ( $dir ): array {
	$fh = fopen( "$dir/$file", 'r' ); $head = fgetcsv( $fh ); $rows = [];
	while ( ( $r = fgetcsv( $fh ) ) !== false ) { $rows[] = array_combine( $head, $r ); }
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
	$post_id  = wp_insert_post( [
		'ID' => $existing ? $existing->ID : 0, 'post_type' => 'figure', 'post_status' => 'publish',
		'post_name' => $f['post_name'], 'post_title' => $f['post_title'], 'post_excerpt' => $f['why'],
	], true );
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
	$post_id  = wp_insert_post( [
		'ID' => $existing ? $existing->ID : 0, 'post_type' => 'ranking_entry', 'post_status' => 'publish',
		'post_name' => $slug, 'post_title' => $r['post_title'],
	], true );
	if ( is_wp_error( $post_id ) ) { WP_CLI::warning( "ranking $slug: " . $post_id->get_error_message() ); continue; }
	foreach ( [ 'rank', 'year', 'kind', 'decade', 'note', 'fig' ] as $k ) { update_post_meta( $post_id, $k, $r[ $k ] ); }
	wp_set_object_terms( $post_id, $r['board'], 'ranking_board' );
	if ( $r['world'] ) { wp_set_object_terms( $post_id, $r['world'], 'world' ); }
	$n++;
}
WP_CLI::success( "rankings: $n" );
