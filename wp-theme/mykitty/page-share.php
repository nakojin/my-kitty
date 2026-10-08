<?php
/**
 * Template Name: 공유 카드
 * 공유 카드 (S8). 전부 클라이언트. 이미지 저장은 app.js 가 <canvas> 로 PNG 를 그린다.
 */
get_header();
?>
<div class="view pad" data-screen="share" style="display:flex;flex-direction:column;gap:12px;min-height:100%">
	<div style="display:flex;justify-content:space-between;align-items:center"><div class="t">공유 카드</div><a href="<?php echo esc_url( home_url( '/collection/' ) ); ?>" class="muted" aria-label="닫기"><?php echo mykitty_icon( 'x' ); ?></a></div>
	<div data-share-card style="width:230px;aspect-ratio:9/16;margin:0 auto;position:relative;overflow:hidden;padding:14px;display:flex;flex-direction:column;border:1px solid var(--line)"></div>
	<div><div class="label" style="margin-bottom:6px">배경</div><div style="display:flex;gap:8px" data-share-bgs></div></div>
	<div style="flex:1"></div>
	<div style="display:flex;gap:8px">
		<button type="button" class="cta sub" style="flex:1" data-share-save><span><?php echo mykitty_icon( 'download' ); ?>이미지 저장</span></button>
		<button type="button" class="cta sub" style="flex:1" data-share-copy><span><?php echo mykitty_icon( 'link' ); ?>링크 복사</span></button>
		<button type="button" class="cta theme" style="flex:1" data-share-go><span><?php echo mykitty_icon( 'share-2' ); ?>공유</span></button>
	</div>
	<canvas data-share-canvas width="1080" height="1920" hidden></canvas>
</div>
<?php get_footer(); ?>
