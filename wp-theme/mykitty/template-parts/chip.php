<?php
/** 칩. args: label, on, class, href(있으면 <a>, 없으면 <span>). */
$label = $args['label'] ?? '';
$on    = ! empty( $args['on'] );
$class = trim( 'chip ' . ( $args['class'] ?? '' ) . ( $on ? ' on' : '' ) );
$href  = $args['href'] ?? '';
$tag   = $href ? 'a' : 'span';
?>
<<?php echo $tag; ?> class="<?php echo esc_attr( $class ); ?>"<?php if ( $href ) : ?> href="<?php echo esc_url( $href ); ?>"<?php endif; ?><?php if ( $on ) : ?> aria-current="true"<?php endif; ?>><span><?php echo esc_html( $label ); ?></span></<?php echo $tag; ?>>
