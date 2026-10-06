<?php
/** 랭킹 행. args: id, compact. */
$id      = (int) ( $args['id'] ?? get_the_ID() );
$compact = ! empty( $args['compact'] );
$rank    = (int) get_post_meta( $id, 'rank', true );
$year    = get_post_meta( $id, 'year', true );
$kind    = get_post_meta( $id, 'kind', true );
$note    = get_post_meta( $id, 'note', true );
$fig     = (int) get_post_meta( $id, 'fig', true );
$worlds  = get_the_terms( $id, 'world' );
$world   = $worlds && ! is_wp_error( $worlds ) ? $worlds[0] : null;
$tag     = $world ? 'a' : 'div';
?>
<<?php echo $tag; ?> class="rank<?php echo $rank <= 3 ? ' top3' : ''; ?>"<?php if ( $world ) : ?> href="<?php echo esc_url( mykitty_term_url( $world ) ); ?>"<?php endif; ?>>
	<div class="no"><?php echo $rank; ?></div>
	<div class="body">
		<div class="t"><?php echo esc_html( get_the_title( $id ) ); ?></div>
		<div class="meta"><span><?php echo esc_html( $year ); ?></span><span><?php echo esc_html( $kind ); ?></span><?php if ( ! $compact && $note ) : ?><span>· <?php echo esc_html( $note ); ?></span><?php endif; ?></div>
	</div>
	<div class="fig" title="피규어 시장"><?php for ( $i = 1; $i <= 3; $i++ ) : ?><i class="<?php echo $i <= $fig ? 'on' : ''; ?>"></i><?php endfor; ?></div>
	<?php if ( $world ) : ?><span class="go">월드 ›</span><?php endif; ?>
</<?php echo $tag; ?>>
