<?php
/**
 * 피규어 상세 본문 (S4). single-figure.php(전체 페이지)와 바텀시트(?partial=1) 양쪽에서 같은 파트를 쓴다.
 * args: id
 */
$id     = (int) ( $args['id'] ?? get_the_ID() );
$world  = mykitty_figure_world( $id );
$slug   = get_post_field( 'post_name', $id );
$rarity = get_post_meta( $id, 'rarity', true ) ?: 'common';
$r      = mykitty_rarity_map()[ $rarity ] ?? mykitty_rarity_map()['common'];
$img    = get_post_meta( $id, 'product_image', true ) ?: ( get_the_post_thumbnail_url( $id, 'large' ) ?: '' );
$line   = get_post_meta( $id, 'line', true );
$same   = $world ? get_posts( [
	'post_type' => 'figure', 'posts_per_page' => 3, 'post__not_in' => [ $id ],
	'tax_query' => [ [ 'taxonomy' => 'world', 'field' => 'term_id', 'terms' => $world->term_id ] ],
	'meta_query' => [ [ 'key' => 'line', 'value' => $line ] ],
] ) : [];
$coupang = get_post_meta( $id, 'coupang_url', true );
?>
<div class="body" style="<?php echo $world ? mykitty_world_style( $world ) : ''; ?>">
	<div style="height:200px;transform:skew(-3deg)"><?php mykitty_img_slot( 'COUPANG-' . $slug, 'product', $img, '상품 이미지<br>(쿠팡 제공)' ); ?></div>

	<div style="margin-top:12px">
		<div class="muted small"><?php echo esc_html( get_post_meta( $id, 'maker', true ) ); ?> · <?php echo esc_html( $line ); ?></div>
		<h1 class="display" style="font-size:22px;margin:2px 0 0"><?php echo esc_html( get_the_title( $id ) ); ?></h1>
		<div class="chips" style="margin-top:8px">
			<?php mykitty_chip( $r['label'], false, 'r-' . $rarity ); ?>
			<?php if ( $s = get_post_meta( $id, 'size', true ) ) { mykitty_chip( $s ); } ?>
			<?php if ( $p = get_post_meta( $id, 'price', true ) ) { mykitty_chip( $p ); } ?>
			<?php if ( $world ) { mykitty_chip( $world->name, false, '', get_term_link( $world ) ); } ?>
		</div>
	</div>

	<?php if ( $why = get_post_meta( $id, 'why', true ) ) : ?>
		<div class="panel" style="margin-top:12px"><div class="label">추천 이유</div><div class="small" style="margin-top:4px"><?php echo esc_html( $why ); ?></div></div>
	<?php endif; ?>

	<?php if ( $content = get_post_field( 'post_content', $id ) ) : ?>
		<div class="entry-content small" style="margin-top:12px"><?php echo apply_filters( 'the_content', $content ); ?></div>
	<?php endif; ?>

	<details class="panel flat" style="margin-top:10px;padding:10px 12px">
		<summary class="label" style="cursor:pointer;list-style:none;display:flex;justify-content:space-between">정품 체크포인트 3 <span>▾</span></summary>
		<ol class="small muted" style="margin:8px 0 0;padding-left:18px">
			<li>상자에 저작권 표기(ⓒ 원작자／출판사·제작위원회)와 제조사 로고</li>
			<li>굿스마일·메가하우스는 홀로그램 정품 씰</li>
			<li>시세보다 절반 이하로 싸면 의심</li>
		</ol>
	</details>

	<div class="label" style="margin-top:14px"><?php echo esc_html( $r['label'] ); ?> · <?php echo esc_html( $r['hint'] ); ?></div>

	<?php if ( $same ) : ?>
		<div style="margin-top:8px"><div class="label" style="margin-bottom:6px">같은 라인 · 크기 맞추기</div>
		<div class="grid3"><?php foreach ( $same as $sp ) { mykitty_figure_card( $sp->ID ); } ?></div></div>
	<?php endif; ?>

	<p class="muted" style="font-size:10px;margin-top:14px">가격대는 작성 시점의 대략적 시세입니다. 실제 가격은 쿠팡에서 확인하세요.</p>
</div>
<div class="foot" style="<?php echo $world ? mykitty_world_style( $world ) : ''; ?>">
	<button type="button" class="cta sub" data-coll="<?php echo esc_attr( $slug ); ?>" style="flex:0 0 118px"><span>♡ 도감 담기</span></button>
	<?php mykitty_coupang_cta( $coupang ); ?>
</div>
