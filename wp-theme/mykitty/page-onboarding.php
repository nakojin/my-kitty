<?php
/**
 * Template Name: 온보딩
 * 온보딩 (S1). 서버: 월드 타일 전부. 클라이언트: 선택·카운터·다음.
 */
get_header();
$worlds = get_terms( [ 'taxonomy' => 'world', 'hide_empty' => false, 'meta_key' => 'world_no', 'orderby' => 'meta_value_num' ] );
?>
<div class="view pad" data-screen="onboarding" style="position:relative;min-height:100%;display:flex;flex-direction:column;gap:12px">
	<div class="splat" style="width:110px;height:110px;right:-40px;top:-30px"></div>
	<div class="splat ink" style="width:12px;height:12px;right:80px;top:70px"></div>
	<div style="margin-top:10px">
		<div class="label">STEP 1 / 2</div>
		<h1 class="display" style="font-size:30px;margin:6px 0 0">좋아하는 작품을<br><span class="brush">3개 이상</span> 골라줘</h1>
		<p class="muted small" style="margin:10px 0 0">고를수록 추천이 정확해져요. 최대 5개.</p>
	</div>
	<div class="grid3" data-ob-grid>
		<?php foreach ( (array) $worlds as $w ) : if ( is_wp_error( $w ) ) continue; ?>
			<button type="button" class="poster" data-ob="<?php echo esc_attr( $w->slug ); ?>" style="<?php echo mykitty_world_style( $w ); ?>">
				<?php mykitty_img_slot( get_term_meta( $w->term_id, 'hero_slot', true ), '', '', ' ' ); ?>
				<span class="cap"><?php echo esc_html( $w->name ); ?></span>
			</button>
		<?php endforeach; ?>
	</div>
	<div style="flex:1"></div>
	<div style="display:flex;align-items:center;gap:12px">
		<div class="display" style="font-size:22px"><span data-ob-count>0</span><span class="muted" style="font-size:12px">/3+</span></div>
		<button type="button" class="cta theme" data-ob-next disabled style="flex:1"><span>다음 →</span></button>
	</div>
</div>
<?php get_footer(); ?>
