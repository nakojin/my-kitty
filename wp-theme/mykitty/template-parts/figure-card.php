<?php
/** 피규어 포스터 카드. args: id. 도감 상태(보유/위시)는 클라이언트(store.js)가 data-figure 로 칠한다. */
$id     = (int) ( $args['id'] ?? get_the_ID() );
$rarity = get_post_meta( $id, 'rarity', true ) ?: 'common';
$map    = mykitty_rarity_map();
$img    = get_post_meta( $id, 'product_image', true ) ?: ( get_the_post_thumbnail_url( $id, 'mk-poster' ) ?: '' );
$slug   = get_post_field( 'post_name', $id );
?>
<a class="poster none" href="<?php echo esc_url( get_permalink( $id ) ); ?>" data-figure="<?php echo esc_attr( $slug ); ?>" data-sheet>
	<?php mykitty_img_slot( 'COUPANG-' . $slug, 'product', $img, ' ' ); ?>
	<span class="tag"><?php echo esc_html( $map[ $rarity ]['label'] ?? $rarity ); ?></span>
	<span class="cap"><?php echo esc_html( get_the_title( $id ) ); ?></span>
</a>
