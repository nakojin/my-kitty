<?php
/** 이미지 슬롯. args: slot, class, src, inner. 파일(assets/img/<slot>.webp) 또는 src 가 있으면 이미지, 없으면 자리표시자. */
$slot  = $args['slot'] ?? '';
$class = $args['class'] ?? '';
$src   = $args['src'] ?? '';
$inner = $args['inner'] ?? '';
if ( ! $src && $slot ) {
	$file = MYKITTY_DIR . '/assets/img/' . $slot . '.webp';
	if ( file_exists( $file ) ) { $src = MYKITTY_URI . '/assets/img/' . $slot . '.webp'; }
}
?>
<div class="img-slot <?php echo esc_attr( $class ); ?>" data-slot="<?php echo esc_attr( $slot ); ?>">
	<?php if ( $src ) : ?><img src="<?php echo esc_url( $src ); ?>" alt="" loading="lazy" decoding="async"><?php endif; ?>
	<?php echo $inner ? wp_kses_post( $inner ) : esc_html( $slot ); ?>
</div>
